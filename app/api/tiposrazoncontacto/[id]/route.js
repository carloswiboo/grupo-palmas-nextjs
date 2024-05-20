export const revalidate = 0;

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import nodemailer from "nodemailer";

/**
 * @swagger
 * /api/tiposrazoncontacto/{id}:
 *   get:
 *     description: Retorna los tipos de razones de contacto
 *     tags:
 *       - Público - Tipos de Razón de contacto
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: El año que se desea consultar
 *     responses:
 *       200:
 *         description: Retorna los tipos de razones de contacto
 */
export async function GET(request, { params }) {
  try {
    const result = await prisma.tiposrazoncontacto.findUnique({
      where: {
        status: 1,
        idtiposrazoncontacto: parseInt(params.id),
      },
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
