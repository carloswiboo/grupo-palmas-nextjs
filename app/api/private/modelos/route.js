export const revalidate = 0;
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import { parse } from "handlebars";

/**
 * @swagger
 * /api/private/modelos:
 *   get:
 *     description: Retorna los modelos
 *     tags:
 *        - Privada - Modelos
 *     responses:
 *       200:
 *         description: Regresa los modelos activos
 */
export async function GET(request, { params }) {
  try {
    const result = await prisma.modelos.findMany({
      where: {
        status: 1,
      },
      include: {
        anios: {
          where: {
            status: 1,
          },
        },
        colores_modelos: {
          where: {
            status: 1,
          },
          include: {
            colores: {
              where: {
                status: 1,
              },
            },
            modelos: {
              where: {
                status: 1,
              },
            },
          },
        },
      },
    });
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/private/modelos:
 *   post:
 *     description: Crear un nuevo modelo
 *     tags:
 *       - Privada - Modelos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              idanios:
 *                 type: int
 *                 description: id año
 *                 example: 2024
 *              nombre:
 *                 type: string
 *                 description: Nombre del modelo
 *                 example: Nombre del modelo
 *              frase:
 *                 type: string
 *                 description: Frase de ayuda
 *                 example: alguna frase de ayuda
 *              imagen:
 *                 type: string
 *                 description: url imagen
 *                 example: url de la imagen
 *              url:
 *                 type: string
 *                 description: url auto
 *                 example: url del auto
 *              pdf:
 *                 type: string
 *                 description: url pdf
 *                 example: url del pdf
 *              orden:
 *                 type: int
 *                 description: orden
 *                 example: 1
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
  try {
    var resultado = await request.json();
    resultado.status = 1;
    resultado.created_at = new Date().toISOString();
    resultado.updated_at = new Date().toISOString();
    resultado.idanios = parseInt(resultado.idanios);

    const resultadoConsulta = await prisma.modelos.create({
      data: resultado,
    });
    return NextResponse.json(resultadoConsulta, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/private/modelos:
 *   patch:
 *     description: Actualizar un Modelo
 *     tags:
 *       - Privada - Modelos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              idmodelos:
 *                 type: int
 *                 description: id Modelo
 *                 example: 1
 *              idanios:
 *                 type: int
 *                 description: id año
 *                 example: 1
 *              nombre:
 *                 type: string
 *                 description: Nombre del modelo
 *                 example: Nombre del modelo
 *              frase:
 *                 type: string
 *                 description: Frase de ayuda
 *                 example: alguna frase de ayuda
 *              imagen:
 *                 type: string
 *                 description: url imagen
 *                 example: url de la imagen
 *              url:
 *                 type: string
 *                 description: url auto
 *                 example: url del auto
 *              pdf:
 *                 type: string
 *                 description: url pdf
 *                 example: url del pdf
 *              orden:
 *                 type: int
 *                 description: orden
 *                 example: 1
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
  let id = parseInt(resultado.idmodelos);
  delete resultado.idmodelos;
  resultado.idanios = parseInt(resultado.idanios);
  resultado.status = 1;
  resultado.updated_at = new Date().toISOString();
  try {
    const consulta = await prisma.modelos.update({
      where: {
        idmodelos: id,
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
 * /api/private/modelos:
 *   delete:
 *     description: Eliminar un Modelo
 *     tags:
 *       - Privada - Modelos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: int
 *                 description: id del modelo
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

    const consulta = await prisma.modelos.update({
      where: {
        idmodelos: parseInt(id),
      },
      data: { status: 0 },
    });
    return NextResponse.json(consulta, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
