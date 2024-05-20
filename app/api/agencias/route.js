export const revalidate = 0;

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import nodemailer from "nodemailer";

/**
 * @swagger
 * /api/agencias/:
 *   get:
 *     description: Retorna las agencias activas
 *     tags:
 *       - Público - Agencias
 *     responses:
 *       200:
 *         description: Retorna las agencias activas
 */
export async function GET(request, { params }) {
  debugger;
  try {
    const result = await prisma.agencias.findMany({
      where: {
        status: 1,
      },
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
