export const revalidate = 0;
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { DateTime } from 'luxon';
/**
 * @swagger
 * /api/private/promociones:
 *   post:
 *     description: Crear una nueva promoción
 *     tags:
 *       - Privada - Promociones
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               urlImagen:
 *                 type: string
 *                 description: Url de la imagen
 *                 example: https://downloads.wiboo.com.mx/wl/?id=2NWg2ZNTIpEbx8uxsVPQXGwKjuecYIkp&fmode=open
 *               urlDestino:
 *                 type: string
 *                 description: url a donde llevará
 *                 example: https://www.suzukipalmas.com.mx
 *               fechaInicio:
 *                 type: string
 *                 description: Fecha de inicio de la promoción
 *                 example: 2024-06-01 00:00:00
 *               fechaFin:
 *                 type: string
 *                 description: Fecha de fin de la promoción
 *                 example: 2024-06-30 23:59:59
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
  resultado.fechaInicio = new Date(resultado.fechaInicio).toISOString();
  resultado.fechaFin = new Date(resultado.fechaFin).toISOString();

  try {
    const promocionesEnRango = await prisma.promociones.create({
      data: resultado,
    });



    return NextResponse.json(promocionesEnRango, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
