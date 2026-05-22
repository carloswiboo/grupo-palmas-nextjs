export const revalidate = 0;

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";

export async function GET(request) {
  try {
    // 1. Obtener y verificar el token de sesión del usuario
    const verifiedToken = await verifyAuth(request);
    if (!verifiedToken || Object.keys(verifiedToken).length === 0) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const idusuario = verifiedToken.idusuario;

    // 2. Consultar las pantallas autorizadas directamente para este usuario
    const userMenus = await prisma.usuarios_menu.findMany({
      where: {
        idusuario: idusuario,
        status: 1,
      },
      include: {
        menu: true,
      },
    });

    // 3. Fallback de Seguridad: Si el usuario no tiene ninguna pantalla asignada aún,
    // retornamos todos los menús para evitar bloqueos durante la transición o para usuarios legacy.
    if (userMenus.length === 0) {
      const allMenus = await prisma.menu.findMany({
        where: { status: 1 },
      });
      allMenus.sort((a, b) => a.idmenu - b.idmenu);
      return NextResponse.json(allMenus, { status: 200 });
    }

    // 4. Extraer y filtrar solo menús que estén activos
    const filteredMenus = userMenus
      .map((um) => um.menu)
      .filter((m) => m !== null && m.status === 1);

    // Ordenar menús por id para mantener consistencia visual
    filteredMenus.sort((a, b) => a.idmenu - b.idmenu);

    return NextResponse.json(filteredMenus, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

