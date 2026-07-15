export const revalidate = 0;
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { DateTime } from "luxon";
export async function POST(request) {
  var resultado = await request.json();
  resultado.status = 1;
  resultado.created_at = new Date().toISOString();
  resultado.updated_at = new Date().toISOString();
  resultado.fechaInicio = new Date(resultado.fechaInicio).toISOString();
  resultado.fechaFin = new Date(resultado.fechaFin).toISOString();
  try {
    const promocionesEnRango = await prisma.promociones.create({
      data: resultado,
    });
    return NextResponse.json(promocionesEnRango, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  let resultado = await request.json();
  let id = parseInt(resultado.idpromociones);
  delete resultado.idpromociones;
  resultado.status = 1;
  resultado.updated_at = new Date().toISOString();
  resultado.fechaInicio = new Date(resultado.fechaInicio).toISOString();
  resultado.fechaFin = new Date(resultado.fechaFin).toISOString();

  try {
    const consulta = await prisma.promociones.update({
      where: {
        idpromociones: id,
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

    const consulta = await prisma.promociones.update({
      where: {
        idpromociones: parseInt(id),
      },
      data: { status: 0 },
    });
    return NextResponse.json(consulta, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
