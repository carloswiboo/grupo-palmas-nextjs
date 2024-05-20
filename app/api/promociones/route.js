export const revalidate = 0;

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import nodemailer from "nodemailer";


/**
 * @swagger
 * /api/promociones/:
 *   get:
 *     description: Retorna las promociones actuales (con las fechas dictadas desde el sistema)
 *     tags:
 *          - Público - Promociones
 *     responses:
 *       200:
 *         description: Retorna todas las promociones habilitadas
 */
export async function GET(request) {
  try {
    const promocionesEnRango = await prisma.promociones.findMany({
      where: {
        fechaInicio: {
          lte: new Date(), // Fecha actual o fecha límite inferior
        },
        fechaFin: {
          gte: new Date(), // Fecha actual o fecha límite superior
        },
        status: 1,
      },
    });

    return NextResponse.json(promocionesEnRango, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
