export const revalidate = 0;
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import { parse } from "handlebars";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
/**
 * @swagger
 * /api/private/users/updatepassword:
 *   patch:
 *     description: Actualizar Contraseña de un usuario
 *     tags:
 *       - Privada - Usuarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              idusuario:
 *                 type: int
 *                 description: Identificador de usuario
 *                 example: 1
 *              contrasena:
 *                 type: string
 *                 description: Contraseña
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Retorna éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indica que fue actualizada correctamente
 *                   example: true
 *       400:
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indica que falló
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Descripción del error
 *                   example: 'Email already in use'
 */
export async function PATCH(request) {
  let resultado = await request.json();
  let id = parseInt(resultado.contrasena);
  delete resultado.contrasena;
  resultado.status = 1;

  debugger;

  resultado.contrasena = await hashPassword(resultado.contrasena);

  debugger;

  resultado.updated_at = new Date().toISOString();
  try {
    const consulta = await prisma.usuarios.update({
      where: {
        idusuario: id,
      },
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
      from: "Help Desk Wiboo - Digitalia <carlos@wiboo.com.mx>",
      to: resultCreacionUsuario.email,
      subject: "Notificación de modificación de contraseña",
      html: `Hola, te informamos que se ha modificado la contraseña para acceder al sistema del Grupo Palmas. Si no fuiste tú, por favor, contacta al administrador del sistema`,
    });

    return NextResponse.json(consulta, { status: 200 });
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
