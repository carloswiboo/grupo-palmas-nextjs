import { NextResponse } from "next/server";
import { verifyAuth } from "./lib/auth";
import { serialize } from "cookie";

// Esta función puede ser marcada `async` si se usa `await` dentro
export async function middleware(request) {
  const { pathname } = new URL(request.url);

  // Verificar si el usuario está tratando de acceder a las páginas de login o recover
  if (pathname.startsWith("/login") || pathname.startsWith("/recover")) {
    let verifiedToken = await verifyAuth(request);

    // Si el usuario está autenticado, redirigir a dashboard
    if (Object.keys(verifiedToken).length !== 0) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  } else {
    // Verificar autenticación para otras rutas protegidas
    let verifiedToken = await verifyAuth(request);

    // Si no hay token verificado, redirigir a login y eliminar la cookie
    if (Object.keys(verifiedToken).length === 0) {
      const cookieString = serialize(process.env.COOKIE_NAME, "", {
        maxAge: -1, // Establece una fecha de caducidad pasada para eliminar la cookie
        path: "/", // Asegúrate de establecer el mismo path que usaste al establecer la cookie
      });
      let response = NextResponse.redirect(new URL("/login", request.url));
      // Establece la cabecera de la cookie eliminada en la respuesta
      response.headers.set("Set-Cookie", cookieString);
      return response;
    }
  }

  // Continuar con la solicitud si está autenticado o en una ruta pública
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/private:path*",
    "/dashboard/:path*",
    "/login/:path*",
    "/recover/:path*",
  ],
};
