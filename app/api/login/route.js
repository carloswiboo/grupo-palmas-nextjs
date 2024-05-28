export const revalidate = 0;

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import { createToken } from "@/lib/createToken";

/**
 * @swagger
 * /api/login:
 *   post:
 *     description: Permite iniciar la sesión del usuario al sistema
 *     tags:
 *       - Pública - Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuario:
 *                 type: string
 *                 description: Correo electrónico de usuario
 *                 example: correo@prueba.com
 *               password:
 *                 type: string
 *                 description: Contraseña de Usuario
 *                 example: contrasenausuario
 *     responses:
 *       200:
 *         description: Retorna el token del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: ID del usuario creado
 *                   example: '60d0fe4f5311236168a109ca60d0fe4f5311236168a109ca60d0fe4f5311236168a109ca60d0fe4f5311236168a109ca60d0fe4f5311236168a109ca60d0fe4f5311236168a109ca'
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
 *                   example: 'Usuario y / contraseña no válidos.'
 */
export async function POST(request) {
  //Obtenemos primero el usuario y contraseña desde la llamada
  var resultado = await request.json();
  //Extraigo las variables
  const { usuario, password } = resultado;

  //Revisao que las variables que manden si sean usuario y contraseña
  if (!usuario || !password) {
    return NextResponse.json(
      { error: "Faltan usuario o contraseña" },
      { status: 400 }
    );
  }

  try {
    //Aqui buscamos pen primara instancia que el usaurio exista
    const user = await prisma.usuarios.findMany({
      where: {
        email: usuario,
        status: 1,
      },
    });

    /* Revisar que exista */
    if (user.length === 0) {
      /* Send error with message */
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 400 }
      );
    }

    const isMatch = await bcrypt.compare(password, user[0].contrasena);

    delete user.contrasena;

    if (isMatch == true) {
      const payload = user[0];
      delete payload.contrasena;
      delete payload.activacion;
      delete payload.cambiopassword;
      debugger;
      const token = await createToken(payload);

      return NextResponse.json({ token: token }, { status: 500 });
      debugger;
    } else {
      return NextResponse.json(
        { error: "Contraseña Incorrecta" },
        { status: 500 }
      );
    }

    //Si el usuario existe, hago el parseo de contraseña y verifico que todo este bien
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
