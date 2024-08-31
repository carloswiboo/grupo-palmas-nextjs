export const revalidate = 0;

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import nodemailer from "nodemailer";

/**
 * @swagger
 * /api/anios/:
 *   get:
 *     description: Retorna el año público
 *     tags:
 *       - Público - Años
 *     parameters:
 *       - in: query
 *         name: id
 *         required: false
 *         schema:
 *           type: integer
 *         description: El año que se desea consultar
 *     responses:
 *       200:
 *         description: Regresa los años activos
 */
export async function GET(request, { params }) {
  try {
    const result = await prisma.categoriaauto.findMany({
      where: {
        status: 1,
      },
    });
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
