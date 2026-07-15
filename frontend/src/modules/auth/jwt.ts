import { SignJWT, jwtVerify, JWTPayload } from "jose";
import { UserRole } from "@prisma/client";

export interface AuthTokenPayload extends JWTPayload {
  userId: string;
  schoolId: string;
  role: UserRole;
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function createToken(
  payload: AuthTokenPayload
): Promise<string> {
  return await new SignJWT({
    userId: payload.userId,
    schoolId: payload.schoolId,
    role: payload.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(
  token: string
): Promise<AuthTokenPayload> {
  const { payload } = await jwtVerify(token, secret);

  return payload as AuthTokenPayload;
}