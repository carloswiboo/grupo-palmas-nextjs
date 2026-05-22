export const revalidate = 0;

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";

export async function POST(request) {
  const { usuario } = await request.json();

  if (!usuario) {
    return NextResponse.json(
      { error: "Por favor ingresa un correo electrónico" },
      { status: 400 }
    );
  }

  try {
    const users = await prisma.usuarios.findMany({
      where: { email: usuario, status: 1 },
    });

    // Por seguridad, siempre respondemos "éxito" aunque no exista el usuario
    // para no revelar qué correos están registrados.
    if (users.length === 0) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const user = users[0];

    // Generar token único y seguro
    const token = crypto.randomUUID() + "-" + crypto.randomBytes(16).toString("hex");

    // Guardar token en el campo cambiopassword del usuario
    await prisma.usuarios.update({
      where: { idusuario: user.idusuario },
      data: { cambiopassword: token },
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://localhost:3000";
    const resetLink = `${baseUrl}/restablecercontrasena?token=${token}`;

    // Enviar correo con el link
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Grupo Palmas" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: "Restablece tu contraseña — Grupo Palmas",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #f9fafb; padding: 32px; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <img src="https://suzukipalmas.com.mx/assets/suzukiLogo.png" alt="Suzuki Palmas" style="height: 48px;" />
          </div>
          <h2 style="color: #111827; font-size: 20px; margin-bottom: 8px;">Restablecer contraseña</h2>
          <p style="color: #6b7280; font-size: 14px; margin-bottom: 24px;">
            Hola <strong>${user.nombre || "usuario"}</strong>, recibimos una solicitud para restablecer la contraseña de tu cuenta en el panel de administración de <strong>Grupo Palmas</strong>.
          </p>
          <p style="color: #6b7280; font-size: 14px; margin-bottom: 24px;">
            Da clic en el botón de abajo para crear una nueva contraseña. Este enlace es válido por <strong>24 horas</strong>.
          </p>
          <div style="text-align: center; margin-bottom: 32px;">
            <a href="${resetLink}"
              style="background-color: #dc2626; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-size: 15px; font-weight: 600; display: inline-block;">
              Restablecer contraseña
            </a>
          </div>
          <p style="color: #9ca3af; font-size: 12px;">
            Si no solicitaste este cambio, ignora este correo. Tu contraseña no será modificada.
          </p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
          <p style="color: #d1d5db; font-size: 11px; text-align: center;">
            Grupo Palmas Administración — ${baseUrl}
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
