export const revalidate = 0;

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import nodemailer from "nodemailer";

/**
 * @swagger
 * /api/colores/:
 *   get:
 *     description: Retorna el color activo
 *     tags:
 *       - Público - Colores
 *     responses:
 *       200:
 *         description: Regresa los años activos
 */
export async function GET(request, { params }) {
  debugger;
  try {
    const result = await prisma.colores.findMany({
      where: {
        status: 1,
      },
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
