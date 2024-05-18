export const revalidate = 0;

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import nodemailer from "nodemailer";

/**
 * @swagger
 * /api/anios:
 *   get:
 *     description: Retorna los años públicos
 *     tags:
 *      - Años
 *     responses:
 *       200:
 *         description: hello world
 */
export async function GET(request) {
  try {
    const result = await prisma.anios.findMany({
      where: {
        status: 1,
      },
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
