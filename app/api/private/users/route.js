export const revalidate = 0;

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";

export async function GET(request) {
  try {
    const data = await prisma.usuarios.findMany({
      where: {
        status: 1,
      },
    });

    const sanitizedData = data.map((user) => {
      const { contrasena, ...rest } = user;
      return rest;
    });

    return NextResponse.json(sanitizedData, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  var resultado = await request.json();
  try {
    if (
      !resultado.nombre ||
      !resultado.apellidopaterno ||
      !resultado.apellidomaterno ||
      !resultado.email ||
      !resultado.contrasena
    ) {
      throw new Error("Ingresa los campos necesarios");
    }

    const resultCorreos = await prisma.usuarios.findMany({
      where: {
        email: resultado.email,
      },
    });

    if (resultCorreos.length > 0) {
      throw new Error(
        "Ya existe un usuario creado con el correo proporcionado, verifica"
      );
    } else {
      resultado.status = 1; // Active by default so they appear in dashboard
      resultado.contrasena = await hashPassword(resultado.contrasena);
      resultado.activacion = uuidv4();

      const resultCreacionUsuario = await prisma.usuarios.create({
        data: resultado,
      });

      // Safe SMTP transport so failures in email sending do not break registration
      try {
        if (process.env.SMTP_HOST && process.env.SMTP_USER) {
          const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || "587", 10),
            secure: false,
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASSWORD,
            },
          });

          await transporter.sendMail({
            from: "Help Desk Wiboo <notificaciones@gironafilmfestival.com>",
            to: resultCreacionUsuario.email,
            subject: "Notificación de creación de cuenta",
            html: `Hola, te informamos que se ha creado tu cuenta para acceder al sistema del Grupo Palmas. Tu cuenta ya está activa y puedes iniciar sesión directamente.`,
          });
        }
      } catch (mailError) {
        console.warn("SMTP email notification failed to send:", mailError.message);
      }

      return NextResponse.json(resultCreacionUsuario, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function hashPassword(password) {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error("Error hashing password");
  }
}

export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Falta el ID del usuario" }, { status: 400 });
    }

    const consulta = await prisma.usuarios.update({
      where: {
        idusuario: parseInt(id, 10),
      },
      data: { status: 0 },
    });
    return NextResponse.json({ success: true, message: "Usuario eliminado correctamente" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
