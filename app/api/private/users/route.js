export const revalidate = 0;

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";

/**
 * @swagger
 * /api/private/users:
 *   get:
 *     description: Retorna los usuarios activos
 *     tags:
 *       - Privada - Usuarios
 *     responses:
 *       200:
 *         description: Retorna los usuarios activos
 */
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

/**
 * @swagger
 * /api/private/users:
 *   post:
 *     description: Crear un nuevo usuario
 *     tags:
 *       - Privada - Usuarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre de usuario
 *                 example: juanperez
 *               apellidopaterno:
 *                 type: string
 *                 description: Apellido Paterno
 *                 example: Rodriguez
 *               apellidomaterno:
 *                 type: string
 *                 description: Apellido Paterno
 *                 example: Rodriguez
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario
 *                 example: juan.perez@example.com
 *               contrasena:
 *                 type: string
 *                 description: Contraseña del usuario
 *                 example: '123456'
 *     responses:
 *       200:
 *         description: Retorna si el usuario fue creado o no
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indica si el usuario fue creado exitosamente
 *                   example: true
 *                 userId:
 *                   type: string
 *                   description: ID del usuario creado
 *                   example: '60d0fe4f5311236168a109ca'
 *       400:
 *         description: Error en la creación del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indica que la creación del usuario falló
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Descripción del error
 *                   example: 'Email already in use'
 */
export async function POST(request) {
  var resultado = await request.json();
  debugger;
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

    debugger;

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
      resultado.status = 0;
      resultado.contrasena = await hashPassword(resultado.contrasena);
      resultado.activacion = uuidv4();

      const resultCreacionUsuario = await prisma.usuarios.create({
        data: resultado,
      });

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
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
        html: `Hola, te informamos que se ha creado tu cuenta para acceder al sistema del Grupo Palmas </br> Necesitas activar tu cuenta, para hacerlo te invitamos a seguir el siguiente enlace: <a href="${process.env.FINAL_URL}activarcuenta/${resultCreacionUsuario.activacion}">${process.env.FINAL_URL}activarcuenta/${resultCreacionUsuario.activacion}</a>`,
      });

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
