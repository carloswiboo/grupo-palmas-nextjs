export const revalidate = 0;

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import nodemailer from "nodemailer";

export async function GET(request) {
  try {
    const data = await prisma.menu.findMany({
      where: {
        status: 1,
      },
      include: {
        funciones_menu: {
          where: {
            status: 1,
          },
        },
      },
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
