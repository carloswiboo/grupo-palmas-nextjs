export const revalidate = 0;

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import nodemailer from "nodemailer";

//Primero Defino 
export async function POST(request) {

    var resultado = await request.json();
    resultado.status = 1;
    resultado.created_at = new Date().toISOString();
    resultado.updated_at = new Date().toISOString();



}
