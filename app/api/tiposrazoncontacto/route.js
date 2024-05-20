export const revalidate = 0;

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import nodemailer from "nodemailer";

/**
 * @swagger
 * /api/tiposrazoncontacto/:
 *   get:
 *     description: Retorna el tipo de razón
 *     tags:
 *          - Público - Tipos de Razón de contacto
 *     responses:
 *       200:
 *         description: Retorna el detalle sobre el id seleccionado
 */
export async function GET(request, { params }) {
  debugger;
  try {
    const result = await prisma.tiposrazoncontacto.findMany({
      where: {
        status: 1,
      },
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
