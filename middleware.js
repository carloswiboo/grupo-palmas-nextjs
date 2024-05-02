import { NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/private:path*", "/dashboard/:path*"],
};
