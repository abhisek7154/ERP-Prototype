import { SignJWT, jwtVerify, type JWTPayload } from "jose";


const secret = new TextEncoder().encode(
  process.env.JWT_SECRET ?? ""
);


export async function createJWT(payload: JWTPayload) {

  return await new SignJWT(payload as Record<string, unknown>)
    .setProtectedHeader({
      alg: "HS256",
    })
    .setExpirationTime("1d")
    .sign(secret);

}


export async function verifyJWT(token: string) {

  const { payload } = await jwtVerify(
    token,
    secret
  );

  return payload as JWTPayload;

}