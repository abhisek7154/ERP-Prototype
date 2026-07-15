import { cookies } from "next/headers";
import { verifyToken } from "./jwt"

export async function getAuthenticationUser() {
    try {
        const cookiestore = await cookies();
        const token = cookiestore.get("auth-token")?.value

        if(!token){
            return null;
        }

        return await verifyToken(token);
    }catch {
        return null;
    }
}   