export const revalidate = 0;

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import nodemailer from "nodemailer";


/**
 * @swagger
 * /api/modelos/:
 *   get:
 *     description: Retorna los modelos de Suzuki Actuales, activos y con estatus 1
 *     tags:
 *          - Público - Modelos Públicos
 *     responses:
 *       200:
 *         description: Retorna Todos los detalles del auto
 */
export async function GET(request) {
  try {
    const result = await prisma.modelos.findMany({
      where: {
        status: 1,
      },
      include: {
        anios: {
          where: {
            status: 1,
          },
        },
        versiones: {
          where: {
            status: 1,
          },
          orderBy: {
            precio: "asc",
          },
        },
        colores_modelos: {
          where: {
            status: 1,
          },
          include: {
            colores: true,
          },
        },
      },
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
