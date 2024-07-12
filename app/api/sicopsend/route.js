export const revalidate = 0;
import prisma from "@/lib/prisma";

import nodemailer from "nodemailer";
import handlebars from "handlebars";
import { mailTemplate } from "@/handlebars/mailTemplate";

import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { DateTime } from "luxon";
import { NextResponse } from "next/server";

//Creando el post de la aplicación
export async function POST(request) {
  //Obteniendo los datos, y le agrego tambien la fecha de creación
  var resultado = await request.json();

  // Validar que ningún campo sea "" o null
  for (const [key, value] of Object.entries(resultado)) {
    if (value === "" || value === null) {
      return NextResponse.json(
        { error: `El campo ${key} es inválido.` },
        { status: 400 }
      );
    }
  }
  resultado.status = 1;
  resultado.created_at = new Date().toISOString();
  resultado.updated_at = new Date().toISOString();
  //Ya teniendo los primeros datos, necesito llamar la agencia que selecciono el usuario para traer los emails
  const agencia = await prisma.agencias.findUnique({
    where: {
      idagencias: parseInt(resultado.idagencia),
      status: 1,
    },
  });

  const tiposRazonContacto = await prisma.tiposrazoncontacto.findUnique({
    where: {
      idtiposrazoncontacto: parseInt(resultado.tiposrazoncontacto),
      status: 1,
    },
  });

  // const envioCorreos = agencia.reenvioCorreos;

  const envioCorreos = "carlosestrada122@gmail.com";

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const template = handlebars.compile(mailTemplate());

  const html = template({
    title: agencia.nombre + " - Solicitud de " + tiposRazonContacto.nombre,
    content: `¡Hola! ${agencia.nombre} <br />
    
    Te informamos que se ha recibido una solicitud de ${tiposRazonContacto.nombre} con los datos siguientes: <br />

    <ul>
    <li>Nombre: ${resultado.nombreCliente}</li>
    <li>Teléfono: ${resultado.telefonoCliente}</li>
    <li>Correo: ${resultado.emailCliente}</li>
    <li>Modelo: ${resultado.model}</li>
    <li>Fecha de contacto: ${resultado.fechaContacto}</li>
    </ul>

    `,
    link: `${agencia.urlSitio}`,
    buttonLink: `Ver página de ${agencia.nombre}`,
  });

  let resultadoCorreoElectronico = await transporter.sendMail({
    from: "Notificaciones Grupo Palmas Web <carlos@wiboo.com.mx>",
    to: envioCorreos,
    subject: agencia.nombre + " - Solicitud de " + tiposRazonContacto.nombre,
    html: html,
  });

  //Teniendo ya la agencia necesito correr el envío de correo electrónico.

  const dateContact = DateTime.now()
    .setZone("America/Mexico_City")
    .toFormat("yyyy-MM-dd HH:mm:ss");
  const data = `<?xml version="1.0" encoding="UTF-8"?>
  <adf>
    <prospect status="new">
      <id>${uuidv4()}</id>
      <requestdate>${dateContact}</requestdate>
      <vehicle interest="buy" status="new">
        <make>SUZUKI</make>
        <model>${resultado.model}</model>
      </vehicle>
      <customer>
        <contact>
          <name part="full">${resultado.nombreCliente}</name>
          <email>${resultado.emailCliente}</email>
          <phone>${resultado.telefonoCliente}</phone>
        </contact>
        <comments>Fecha de preferencia de contacto:${
          resultado.fechaContacto
        }</comments>
        <origin>${tiposRazonContacto.originType}</origin>
      </customer>
      <vendor>
        <id source="GPOPALMAS">${agencia.seekop_id}</id>
        <vendorname>${agencia.nombre}</vendorname>
      </vendor>
    </prospect>
    <provider>
      <name>GPOPALMAS</name>
    </provider>
  </adf>`;

  const responseFinalSicop = await axios({
    method: "post",
    url: "https://www.sicopweb.com/interface/adf/add/prospect.xml",
    data: data,
    headers: {
      validated: "true",
      "Content-Type": "application/xml",
    },
  });

  console.log(responseFinalSicop);

  try {
    const resultadoConsulta = await prisma.sicop.create({
      data: {
        json: resultado,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 1,
        responsesicop: responseFinalSicop.data,
        responsemail: resultadoCorreoElectronico,
      },
    });

    return NextResponse.json(resultadoConsulta, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
