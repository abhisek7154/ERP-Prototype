import { prisma } from "~/lib/prisma";
import { comparePassword } from "./password";
import { createToken } from "./jwt";


export async function loginUser(email: string,
    password: string
) {
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    console.log("User:", user);

    if(!user){
        console.log("User not found");
        return null;
    }

    if(!user.isActive){
        console.log("User inactive");
        return null;
    }

    const valid = await comparePassword(
        password,
        user.passwordHash
    );

    console.log("Password valid:", valid);

    if(!valid){
        console.log("Wrong password");
        return null;
    }

    const token =  await createToken({
        userId: user.id,
        schoolId: user.schoolId,
        role: user.role,
    });

    return {
        token,
        user,
    };
}