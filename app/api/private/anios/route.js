export const revalidate = 0;
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { DateTime } from "luxon";

/**
 * @swagger
 * /api/private/anios:
 *   get:
 *     description: Retorna el año público
 *     tags:
 *        - Privada - Años
 *     responses:
 *       200:
 *         description: Regresa los años activos
 */
export async function GET(request, { params }) {
  try {
    const result = await prisma.anios.findMany({
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
 * /api/private/anios:
 *   post:
 *     description: Crear una nuevo año
 *     tags:
 *       - Privada - Años
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre del año
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
 *                   description: Indica que la promoción fue creada correctamente
 *                   example: true
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
  resultado.status = 1;
  resultado.created_at = new Date().toISOString();
  resultado.updated_at = new Date().toISOString();
  try {
    const resultadoConsulta = await prisma.anios.create({
      data: resultado,
    });
    return NextResponse.json(resultadoConsulta, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/private/anios:
 *   patch:
 *     description: Actualizar una anio
 *     tags:
 *       - Privada - Años
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idanios:
 *                 type: int
 *                 description: id del año
 *                 example: 1
 *               nombre:
 *                 type: string
 *                 description: Nombre del año
 *                 example: 2025
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
  let resultado = await request.json();
  let id = parseInt(resultado.idanios);
  delete resultado.idanios;
  resultado.status = 1;
  resultado.updated_at = new Date().toISOString();

  try {
    const consulta = await prisma.anios.update({
      where: {
        idanios: id,
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
 * /api/private/promociones:
 *   delete:
 *     description: Eliminar un año
 *     tags:
 *       - Privada - Años
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: int
 *                 description: id de la promoción
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

    const consulta = await prisma.anios.update({
      where: {
        idanios: parseInt(id),
      },
      data: { status: 0 },
    });
    return NextResponse.json(consulta, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
