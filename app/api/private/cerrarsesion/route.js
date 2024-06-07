export const revalidate = 0;
import { parse, serialize } from "cookie";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import nodemailer from "nodemailer";

export async function GET(request) {
  try {
    const cookieString = serialize(process.env.COOKIE_NAME, "", {
      maxAge: -1, // Establece una fecha de caducidad pasada para eliminar la cookie
      path: "/", // Asegúrate de establecer el mismo path que usaste al establecer la cookie
    });
    let response = NextResponse.redirect(new URL("/", request.url));
    // Establece la cabecera de la cookie eliminada en la respuesta
    response.headers.append("Set-Cookie", cookieString);
    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
