export const revalidate = 0;

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";

export async function POST(request) {
  try {
    const verifiedToken = await verifyAuth(request);
    if (!verifiedToken || Object.keys(verifiedToken).length === 0) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const idusuario = parseInt(body.idusuario, 10);
    const idperfil = parseInt(body.idperfil, 10);

    if (isNaN(idusuario) || isNaN(idperfil)) {
      return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
    }

    const usuarioActualizado = await prisma.usuarios.update({
      where: { idusuario },
      data: { idperfil }
    });

    return NextResponse.json(usuarioActualizado, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
