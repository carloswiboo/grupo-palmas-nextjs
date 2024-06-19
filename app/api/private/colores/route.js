export const revalidate = 0;
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { DateTime } from "luxon";

/**
 * @swagger
 * /api/private/colores:
 *   get:
 *     description: Retorna los colores
 *     tags:
 *        - Privada - Colores
 *     responses:
 *       200:
 *         description: Regresa los colores activos
 */
export async function GET(request, { params }) {
  try {
    const result = await prisma.colores.findMany({
      where: {
        status: 1,
      },
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/private/colores:
 *   post:
 *     description: Crear una nuevo color
 *     tags:
 *       - Privada - Colores
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre del color
 *                 example: 2024
 *     responses:
 *       200:
 *         description: Retorna si la promoción fue creada o no
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indica que fue creada correctamente
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
export async function POST(request) {
  var resultado = await request.json();
  resultado.status = 1;
  resultado.created_at = new Date().toISOString();
  resultado.updated_at = new Date().toISOString();
  try {
    const resultadoConsulta = await prisma.colores.create({
      data: resultado,
    });
    return NextResponse.json(resultadoConsulta, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/private/colores:
 *   patch:
 *     description: Actualizar un color
 *     tags:
 *       - Privada - Colores
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idcolores:
 *                 type: int
 *                 description: id del color
 *                 example: 1
 *               nombre:
 *                 type: string
 *                 description: Nombre del color
 *                 example: verde
 *     responses:
 *       200:
 *         description: Retorna el exito de la actualización
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: success
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
 *                   description: algo pasó
 *                   example: false
 *
 */
export async function PATCH(request) {
  debugger;
  let resultado = await request.json();
  let id = parseInt(resultado.idcolores);
  delete resultado.idcolores;
  resultado.status = 1;
  resultado.updated_at = new Date().toISOString();
  debugger;
  try {
    const consulta = await prisma.colores.update({
      where: {
        idcolores: id,
      },
      data: resultado,
    });
    return NextResponse.json(consulta, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/private/colores:
 *   delete:
 *     description: Eliminar un color
 *     tags:
 *       - Privada - Colores
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: int
 *                 description: id del color
 *                 example: 1
 *     responses:
 *       200:
 *         description: Eliminación exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Eliminado correctamente
 *                   example: true
 *       400:
 *         description: Error al eliminar
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Algo pasó
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Descripción del error
 *                   example: 'No se pudo eliminar la promoción'
 */
export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    const consulta = await prisma.colores.update({
      where: {
        idcolores: parseInt(id),
      },
      data: { status: 0 },
    });
    return NextResponse.json(consulta, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
