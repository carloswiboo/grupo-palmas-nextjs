export const revalidate = 0;

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";

export async function GET(request) {
  try {
    const verifiedToken = await verifyAuth(request);
    if (Object.keys(verifiedToken).length === 0) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const perfiles = await prisma.perfiles.findMany({
      where: { status: 1 },
      orderBy: { idperfil: "asc" }
    });

    return NextResponse.json(perfiles, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const verifiedToken = await verifyAuth(request);
    if (Object.keys(verifiedToken).length === 0) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { nombre } = body;

    if (!nombre) {
      return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
    }

    const nuevoPerfil = await prisma.perfiles.create({
      data: {
        nombre,
        status: 1
      }
    });

    return NextResponse.json(nuevoPerfil, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
