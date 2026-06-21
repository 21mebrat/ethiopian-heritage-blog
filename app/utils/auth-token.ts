import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-for-dev-only";

export interface DecodedToken {
  sub?: string;
  userId?: string;
  role: string;
  email?: string;
  [key: string]: any;
}

export async function parseToken(token: string): Promise<DecodedToken | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    return decoded;
  } catch (error) {
    return null;
  }
}
