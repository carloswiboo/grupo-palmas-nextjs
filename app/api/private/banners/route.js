export const revalidate = 0;

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import nodemailer from "nodemailer";

export async function GET(request) {
  try {
    const promocionesEnRango = await prisma.promociones.findMany({
      where: {
        status: 1,
      },
    });

    return NextResponse.json(promocionesEnRango, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
