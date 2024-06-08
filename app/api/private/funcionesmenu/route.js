export const revalidate = 0;

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import nodemailer from "nodemailer";

/**
 * @swagger
 * /api/private/funcionesmenu:
 *   get:
 *     description: Retorna los menús activos con sus funciones, esto para establecer los permisos de los usuarios.
 *     tags:
 *          - Privado - Menú y funciones
 *     responses:
 *       200:
 *         description: Retorna todas los menúes con sus funciones habilitadas, los de status en 1
 */
export async function GET(request) {
  try {
    const data = await prisma.menu.findMany({
      where: {
        status: 1,
      },
      include: {
        funciones_menu: {
          where: {
            status: 1,
          },
        },
      },
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
