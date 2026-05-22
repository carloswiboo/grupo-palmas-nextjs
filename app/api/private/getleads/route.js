export const revalidate = 0;
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const fechaInicio = searchParams.get("fechaInicio");
  const fechaFin = searchParams.get("fechaFin");

  if (!fechaInicio || !fechaFin) {
    return NextResponse.json({ error: "Faltan parámetros de fecha" }, { status: 400 });
  }

  try {
    const leads = await prisma.leads.findMany({
      where: {
        created_at: {
          gte: new Date(fechaInicio + "T00:00:00.000Z"),
          lte: new Date(fechaFin + "T23:59:59.999Z"),
        },
        status: 1, // Leads activos
      },
      include: {
        modelos: {
          select: {
            nombre: true,
          },
        },
        agencias: {
          select: {
            nombre: true,
          },
        },
        tiposrazoncontacto: {
          select: {
            nombre: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    const formattedLeads = leads.map((lead) => ({
      id: lead.idlead,
      nombre: `${lead.nombres || ""} ${lead.apellidos || ""}`.trim() || "N/A",
      telefono: lead.telefono || "N/A",
      correo: lead.correoelectronico || "N/A",
      vehiculo: lead.modelos?.nombre || "N/A",
      agencia: lead.agencias?.nombre || "N/A",
      razon: lead.tiposrazoncontacto?.nombre || "N/A",
      notas: lead.notas || "",
      fecha: lead.created_at,
    }));

    return NextResponse.json(formattedLeads, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
