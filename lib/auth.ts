import { type NextRequest, NextResponse } from "next/server";
import { SignJWT, jwtVerify } from "jose";
import { randomBytes } from "crypto";
import { PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";

const JWT_SECRET = process.env.JWT_SECRET || "i-don't-have-a-secret";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

export async function createToken(payload: any): Promise<string> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(new TextEncoder().encode(JWT_SECRET));

  return token;
}

export async function verifyToken(token: string): Promise<any | null> {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    return payload;
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
}

export function setAuthCookie(token: string): HeadersInit {
  return {
    "Set-Cookie": `auth-token=${token}; HttpOnly; Path=/; Secure; Max-Age=${60 * 60 * 24 * 7}`,
  };
}

export async function getAuthToken(req: NextRequest): Promise<string | undefined> {
  return req.cookies.get("auth-token")?.value;
}

export function clearAuthCookie(): HeadersInit {
  return {
    "Set-Cookie": "auth-token=; HttpOnly; Path=/; Secure; Max-Age=0",
  };
}

export function generateNonce(): string {
  return randomBytes(16).toString("hex");
}

/**
 * Verifies a Solana signature.
 * @param message - The message that was signed.
 * @param signature - The signature to verify.
 * @param publicKey - The public key of the signer.
 * @returns True if the signature is valid, false otherwise.
 */
export async function verifySignature(message: string, signature: string, publicKey: string): Promise<boolean> {
  try {
    // Decode the public key
    const pubKey = new PublicKey(publicKey);

    // Decode the signature
    const signatureBuffer = Buffer.from(signature, "base64");

    // Encode the message
    const messageBuffer = Buffer.from(message);

    const isValid = nacl.sign.detached.verify(
      messageBuffer,
      signatureBuffer,
      pubKey.toBytes()
    );

    return isValid;
  } catch (error) {
    console.error("Error verifying Solana signature:", error);
    return false;
  }
}