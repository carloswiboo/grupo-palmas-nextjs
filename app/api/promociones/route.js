export const revalidate = 0;

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import nodemailer from "nodemailer";

export async function GET(request) {
  try {
    const promocionesEnRango = await prisma.promociones.findMany({
      where: {
        fechaInicio: {
          lte: new Date().toISOString(), // Fecha actual o fecha límite inferior
        },
        fechaFin: {
          gte: new Date().toISOString(), // Fecha actual o fecha límite superior
        },
        status: 1,
      },
      orderBy: {
        created_at: 'desc', // Ordenar por fecha de inicio más reciente primero
      },
    });

    return NextResponse.json(promocionesEnRango, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
