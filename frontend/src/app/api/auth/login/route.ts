import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ADMIN_USER } from "~/modules/auth/admin";
import { createJWT } from "~/modules/auth/jwt";
import { loginSchema } from "~/modules/auth/schema";


export async function POST(req: Request) {

  const body = await req.json();


  const result =
    loginSchema.safeParse(body);


  if (!result.success) {

    return NextResponse.json(
      {
        error: "Invalid data",
      },
      {
        status: 400,
      }
    );

  }


  const { email, password } =
    result.data;


  if (
    email !== ADMIN_USER.email ||
    password !== ADMIN_USER.password
  ) {

    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );

  }


  const token =
    await createJWT({
      email,
      role: ADMIN_USER.role,
    });


  const cookieStore =
    await cookies();


  cookieStore.set(
    "admin-token",
    token,
    {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
    }
  );


  return NextResponse.json(
    {
      success: true,
    }
  );

}