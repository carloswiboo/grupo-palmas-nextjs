export const revalidate = 0;

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import nodemailer from "nodemailer";

/**
 * @swagger
 * /api/colores/{id}:
 *   get:
 *     description: Retorna el color público
 *     tags:
 *       - Público - Colores
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: El año que se desea consultar
 *     responses:
 *       200:
 *         description: Regresa los años activos
 */
export async function GET(request, { params }) {
  try {
    const result = await prisma.colores.findUnique({
      where: {
        status: 1,
        idcolores: parseInt(params.id),
      },
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
