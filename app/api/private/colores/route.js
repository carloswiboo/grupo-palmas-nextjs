export const revalidate = 0;
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { DateTime } from "luxon";

export async function GET(request, { params }) {
  try {
    const result = await prisma.colores.findMany({
      where: {
        status: 1,
      },
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  var resultado = await request.json();
  resultado.status = 1;
  resultado.created_at = new Date().toISOString();
  resultado.updated_at = new Date().toISOString();
  try {
    const resultadoConsulta = await prisma.colores.create({
      data: resultado,
    });
    return NextResponse.json(resultadoConsulta, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  debugger;
  let resultado = await request.json();
  let id = parseInt(resultado.idcolores);
  delete resultado.idcolores;
  resultado.status = 1;
  resultado.updated_at = new Date().toISOString();
  debugger;
  try {
    const consulta = await prisma.colores.update({
      where: {
        idcolores: id,
      },
      data: resultado,
    });
    return NextResponse.json(consulta, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    const consulta = await prisma.colores.update({
      where: {
        idcolores: parseInt(id),
      },
      data: { status: 0 },
    });
    return NextResponse.json(consulta, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
