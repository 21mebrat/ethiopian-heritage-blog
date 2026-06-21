import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// ─── PROTECTED ROUTE PATTERNS ────────────────────────────────────────────────
const PROTECTED_PATHS = ["/admin"];
const PROTECTED_API_PATHS = ["/api/posts/admin"];
const LOGIN_PATH = "/login";

// ─── EDGE-COMPATIBLE JWT SECRET ──────────────────────────────────────────────
function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not defined");
  return new TextEncoder().encode(secret);
}

// ─── MIDDLEWARE ──────────────────────────────────────────────────────────────
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Check if path needs protection ──
  const isProtectedPage = PROTECTED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
  const isProtectedApi = PROTECTED_API_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  if (!isProtectedPage && !isProtectedApi) {
    return NextResponse.next();
  }

  // ── Extract token from cookie ──
  const token = request.cookies.get("__token")?.value;

  if (!token) {
    if (isProtectedApi) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }

  // ── Verify JWT ──
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());

    // Attach user info to request headers for downstream use
    const response = NextResponse.next();
    response.headers.set("x-user-id", payload.sub as string);
    response.headers.set("x-user-email", payload.email as string);
    response.headers.set("x-user-role", payload.role as string);

    return response;
  } catch {
    // Token is invalid or expired — clear it and redirect
    if (isProtectedApi) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const response = NextResponse.redirect(new URL(LOGIN_PATH, request.url));
    response.cookies.delete("__token");
    return response;
  }
}

// ─── MATCHER ─────────────────────────────────────────────────────────────────
export const config = {
  matcher: ["/admin/:path*", "/api/posts/admin/:path*"],
};
