import { NextRequest } from "next/server";

export function getTokenFromRequest(req: NextRequest): string | null {
  try {
    // Authorization: Bearer TOKEN
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return null;
    }

    if (!authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return null;
    }

    return token;
  } catch {
    return null;
  }
}