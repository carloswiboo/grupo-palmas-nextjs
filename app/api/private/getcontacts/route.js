export const revalidate = 0;
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { DateTime } from "luxon";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const fechaInicio = searchParams.get("fechaInicio");
  const fechaFin = searchParams.get("fechaFin");

  try {
    const result = await prisma.sicop.findMany({
      where: {
        created_at: {
          gte: new Date(fechaInicio),
          lte: new Date(fechaFin),
        },
        status: 1,
      },
    });

    const resultAgencias = await prisma.agencias.findMany({
      where: {
        status: 1,
      },
    });

    //Ya teniendo los 2 datos empiezo a armar el objeto que voy a regresar

    let resultFinal = [];

    for (const element of result) {
      let agencia = resultAgencias.find(
        (x) => x.idagencias == element.json.idagencia
      );

      let dato = {
        nombre: element.json.nombreCliente,
        telefono: element.json.telefonoCliente,
        correo: element.json.emailCliente,
        agencia: agencia.nombre,
        vehiculo: element.json.model,
        creacion: element.created_at,
      };

      resultFinal.push(dato);
    }

    return NextResponse.json(resultFinal, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
