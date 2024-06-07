import { NextResponse } from "next/server";
import { verifyAuth } from "./lib/auth";
import { parse, serialize } from "cookie";

// This function can be marked `async` if using `await` inside
export async function middleware(request) {
  let verifiedToken = await verifyAuth(request);

  if (Object.keys(verifiedToken).length === 0) {
    const cookieString = serialize(process.env.COOKIE_NAME, "", {
      maxAge: -1, // Establece una fecha de caducidad pasada para eliminar la cookie
      path: "/", // Asegúrate de establecer el mismo path que usaste al establecer la cookie
    });
    let response = NextResponse.redirect(new URL("/login", request.url));
    // Establece la cabecera de la cookie eliminada en la respuesta
    response.headers.append("Set-Cookie", cookieString);
    return response;
  } else {
    if (request.url.includes("login")) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/api/private:path*", "/dashboard/:path*", "/login/:path*"],
};
