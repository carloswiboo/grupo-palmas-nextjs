export const revalidate = 0;

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import nodemailer from "nodemailer";

/**
 * @swagger
 * /api/agencias/{id}:
 *   get:
 *     description: Retorna la agencia seleccionada
 *     tags:
 *       - Público - Agencias
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: La agencia que se desea consultar
 *     responses:
 *       200:
 *         description: Retorna la agencia
 */
export async function GET(request, { params }) {
  try {
    const result = await prisma.agencias.findUnique({
      where: {
        status: 1,
        idagencias: parseInt(params.id),
      },
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
