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

    const { searchParams } = new URL(request.url);
    const idperfil = parseInt(searchParams.get("idperfil"), 10);

    if (isNaN(idperfil)) {
      return NextResponse.json({ error: "idperfil inválido" }, { status: 400 });
    }

    const permisos = await prisma.perfiles_menu.findMany({
      where: { idperfil, status: 1 },
      select: { idmenu: true }
    });

    const menuIds = permisos.map(p => p.idmenu);
    return NextResponse.json(menuIds, { status: 200 });
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
    const idperfil = parseInt(body.idperfil, 10);
    const menuIds = body.menuIds;

    if (isNaN(idperfil) || !Array.isArray(menuIds)) {
      return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.perfiles_menu.deleteMany({
        where: { idperfil }
      });

      if (menuIds.length > 0) {
        await tx.perfiles_menu.createMany({
          data: menuIds.map(idmenu => ({
            idperfil,
            idmenu,
            status: 1
          }))
        });
      }
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
