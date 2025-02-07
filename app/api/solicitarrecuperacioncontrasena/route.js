export const revalidate = 0;

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import { createToken } from "@/lib/createToken";
import cookie from "cookie";

import { serialize } from "cookie";

export async function POST(request) {
  //Obtenemos primero el usuario y contraseña desde la llamada
  var resultado = await request.json();
  //Extraigo las variables
  const { usuario } = resultado;

  //Revisao que las variables que manden si sean usuario y contraseña
  if (!usuario) {
    return NextResponse.json(
      { error: "Porfavor ingresa un usuario" },
      { status: 400 }
    );
  }

  try {
    //Aqui buscamos pen primara instancia que el usaurio exista
    const user = await prisma.usuarios.findMany({
      where: {
        email: usuario,
        status: 1,
      },
    });

    /* Revisar que exista */
    if (user.length === 0) {
      /* Send error with message */
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 400 }
      );
    }

    debugger;
    // Eliminar la cookie
    const serializedCookie = serialize(process.env.COOKIE_NAME, "", {
      httpOnly: false,
      secure: true,
      sameSite: "strict",
      expires: new Date(0), // Fecha de expiración en el pasado
      path: "/",
    });

    const response = NextResponse.json(
      { success: true, data: "Cookie Eliminada" },
      { status: 200 }
    );
    response.headers.set("Set-Cookie", serializedCookie);

    return response;

    //Si el usuario existe, hago el parseo de contraseña y verifico que todo este bien
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
