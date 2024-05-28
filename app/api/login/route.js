export const revalidate = 0;

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

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
  debugger;
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

    bcrypt.compare(password, user.password).then((isMatch) => {
      /* User matched */
      if (isMatch) {
        debugger;
        /* Create JWT Payload */
        const payload = {
          id: userId,
          nombres: user[0].nombres,
          apellidos: user[0].apellidos,
          tipos_usuarios: user[0].tipos_usuarios,
          ut: user[0].idtipos_usuarios,
          email: userEmail,
          fechaVencimiento: user[0].fechaVencimiento,
        };
        /* Sign token */
        createToken(payload).then((token) => {
          res.status(200).json({
            success: true,
            token: token,
          });
        });
      } else {
        /* Send error with message */
        return NextResponse.json(
          { error: "Contraseña Incorrecta" },
          { status: 500 }
        );
        return;
      }
    });

    //Si el usuario existe, hago el parseo de contraseña y verifico que todo este bien

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
