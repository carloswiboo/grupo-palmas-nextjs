import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";

export async function GET(request) {
  try {
    const verifiedToken = await verifyAuth(request);
    if (!verifiedToken || Object.keys(verifiedToken).length === 0) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const url = new URL(request.url);
    const idusuarioStr = url.searchParams.get("idusuario");
    if (!idusuarioStr) {
      return NextResponse.json({ error: "Falta el idusuario" }, { status: 400 });
    }

    const idusuario = parseInt(idusuarioStr, 10);

    // 1. Obtener todas las pantallas activas del sistema
    const menus = await prisma.menu.findMany({
      where: {
        status: 1,
      },
      orderBy: {
        idmenu: "asc",
      },
    });

    // 2. Obtener las pantallas autorizadas del usuario
    const userMenus = await prisma.usuarios_menu.findMany({
      where: {
        idusuario: idusuario,
        status: 1,
      },
      select: {
        idmenu: true,
      },
    });

    const allowedMenuIds = userMenus
      .map((um) => um.idmenu)
      .filter((id) => id !== null);

    return NextResponse.json({ menus, allowedMenuIds }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const verifiedToken = await verifyAuth(request);
    if (!verifiedToken || Object.keys(verifiedToken).length === 0) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { idusuario, menuIds } = body;

    if (!idusuario || !Array.isArray(menuIds)) {
      return NextResponse.json(
        { error: "Faltan parámetros requeridos (idusuario, menuIds)" },
        { status: 400 }
      );
    }

    const userId = parseInt(idusuario, 10);

    // Ejecutar transaccionalmente: borrar anteriores e insertar los nuevos permisos
    await prisma.$transaction([
      prisma.usuarios_menu.deleteMany({
        where: {
          idusuario: userId,
        },
      }),
      prisma.usuarios_menu.createMany({
        data: menuIds.map((idmenu) => ({
          idusuario: userId,
          idmenu: parseInt(idmenu, 10),
          status: 1,
        })),
      }),
    ]);

    return NextResponse.json({ success: true, message: "Permisos actualizados con éxito" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
