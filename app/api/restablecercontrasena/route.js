export const revalidate = 0;

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// GET: Valida que el token existe en la base de datos
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token requerido" }, { status: 400 });
  }

  try {
    const users = await prisma.usuarios.findMany({
      where: { cambiopassword: token, status: 1 },
    });

    if (users.length === 0) {
      return NextResponse.json(
        { error: "El enlace es inválido o ya fue utilizado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Restablece la contraseña usando el token
export async function POST(request) {
  const { token, nuevaContrasena } = await request.json();

  if (!token || !nuevaContrasena) {
    return NextResponse.json(
      { error: "Token y nueva contraseña son requeridos" },
      { status: 400 }
    );
  }

  if (nuevaContrasena.length < 6) {
    return NextResponse.json(
      { error: "La contraseña debe tener al menos 6 caracteres" },
      { status: 400 }
    );
  }

  try {
    const users = await prisma.usuarios.findMany({
      where: { cambiopassword: token, status: 1 },
    });

    if (users.length === 0) {
      return NextResponse.json(
        { error: "El enlace es inválido o ya fue utilizado" },
        { status: 404 }
      );
    }

    const user = users[0];

    // Hashear la nueva contraseña
    const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);

    // Actualizar contraseña y limpiar el token (evita reutilización)
    await prisma.usuarios.update({
      where: { idusuario: user.idusuario },
      data: {
        contrasena: hashedPassword,
        cambiopassword: null,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
