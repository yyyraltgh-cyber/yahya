import { NextResponse, type NextRequest } from "next/server";

/**
 * In static-export (Capacitor) builds there is no server to run middleware,
 * so auth protection is handled client-side via useAuthGuard. This middleware
 * is a no-op kept for compatibility with a future server deployment.
 */
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
