import { NextResponse } from "next/server";
import { verifyAuth } from "./lib/auth";

// This function can be marked `async` if using `await` inside
export async function middleware(request) {
  let verifiedToken = await verifyAuth(request);

  debugger;
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/private:path*", "/dashboard/:path*"],
};
