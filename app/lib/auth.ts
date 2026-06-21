import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { UserRole } from "../types";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing in .env.local");
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export const generateToken = (
  payload: Omit<JwtPayload, "iat" | "exp">
): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};

export const extractTokenFromRequest = (
  req: NextRequest
): string | null => {

  // Authorization: Bearer TOKEN
  const authHeader = req.headers.get("authorization");

  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }

  // fallback cookie
  const cookieToken = req.cookies.get("__token")?.value;

  if (cookieToken) {
    return cookieToken;
  }

  return null;
};

export const getAuthUser = (
  req: NextRequest
): JwtPayload | null => {

  try {
    const token = extractTokenFromRequest(req);

    if (!token) return null;

    return verifyToken(token);

  } catch {
    return null;
  }
};