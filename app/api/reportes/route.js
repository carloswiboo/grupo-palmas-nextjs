import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import ExcelJS from "exceljs";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const fechaInicio = searchParams.get("fechaInicio");
    const fechaFin = searchParams.get("fechaFin");

    const resultadoConsulta = await prisma.leads.findMany({
      where: {
        created_at: {
          gte: new Date(fechaInicio),
          lte: new Date(fechaFin),
        },
        status: 1,
      },
      include: {
        agencias: {
          select: {
            nombre: true,
          },
          where: {
            status: 1,
          },
        },
        tiposrazoncontacto: {
          select: {
            nombre: true,
          },
          where: {
            status: 1,
          },
        },
      },
    });

    // Crear un nuevo libro de Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Leads");

    // Agregar encabezados
    worksheet.columns = [
      { header: "ID Lead", key: "idlead", width: 10 },
      { header: "Correo Electrónico", key: "correoelectronico", width: 30 },
      {
        header: "Fecha Preferente Contacto",
        key: "fechaPreferenteContacto",
        width: 20,
      },
      { header: "Nombres", key: "nombres", width: 20 },
      { header: "Apellidos", key: "apellidos", width: 20 },
      { header: "Teléfono", key: "telefono", width: 15 },
      { header: "Fecha Creación", key: "created_at", width: 20 },
      { header: "Notas", key: "notas", width: 30 },
      { header: "Agencia", key: "agencia", width: 20 },
      { header: "Tipo Razón Contacto", key: "tipoRazonContacto", width: 20 },
    ];

    // Agregar filas
    resultadoConsulta.forEach((lead) => {
      worksheet.addRow({
        idlead: lead.idlead,
        correoelectronico: lead.correoelectronico,
        fechaPreferenteContacto: lead.fechaPreferenteContacto,
        nombres: lead.nombres,
        apellidos: lead.apellidos,
        telefono: lead.telefono,
        created_at: lead.created_at,
        notas: lead.notas,
        agencia: lead.agencias?.nombre,
        tipoRazonContacto: lead.tiposrazoncontacto?.nombre,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="leads.xlsx"',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
