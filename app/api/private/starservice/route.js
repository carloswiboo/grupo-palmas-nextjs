export const revalidate = 0;
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import { parse } from "handlebars";

export async function GET(request, { params }) {
  try {
    const result = await prisma.modelos.findMany({
      where: {
        status: 1,
      },
      include: {
        anios: {
          where: {
            status: 1,
          },
        },
        starservice: {
          where: {
            status: 1,
          },
        },
        colores_modelos: {
          where: {
            status: 1,
          },
          include: {
            colores: {
              where: {
                status: 1,
              },
            },
            modelos: {
              where: {
                status: 1,
              },
            },
          },
        },
      },
    });
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    var resultado = await request.json();

    resultado.created_at = new Date().toISOString();
    resultado.updated_at = new Date().toISOString();
    resultado.idmodelos = parseInt(resultado.idmodelos);
    resultado.status = parseInt(resultado.status);

    const resultadoConsulta = await prisma.starservice.create({
      data: resultado,
    });
    return NextResponse.json(resultadoConsulta, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  let resultado = await request.json();
  let id = parseInt(resultado.idmodelos);
  delete resultado.idmodelos;
  resultado.idanios = parseInt(resultado.idanios);
  resultado.orden = parseInt(resultado.orden);
  resultado.status = 1;
  resultado.updated_at = new Date().toISOString();
  try {
    const consulta = await prisma.modelos.update({
      where: {
        idmodelos: id,
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

    //Eliminamos modelos
    const consulta = await prisma.starservice.update({
      where: {
        idstarservice: parseInt(id),
      },
      data: { status: 0 },
    });

    return NextResponse.json(consulta, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
