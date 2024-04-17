import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import nodemailer from "nodemailer";

export async function GET(request) {
  try {
    //Primero obtengo el día actual
    const currentDate = DateTime.now().setLocale("es");

    //Aqui lo obtengo
    const actualDay = currentDate.weekdayLong;

    const horaActual = currentDate.toFormat("T");

    //Me traigo los correos que tendríamos que mandar

    const resultMails = await prisma.mails.findMany({
      where: {
        status: 1,
      },
      include: {
        mail_schedule: true,
      },
    });

    let finalCorreosEnviar = [];

    for (const correos of resultMails) {
      let queSeaDelDia = correos.mail_schedule.filter(
        (valorBuscar) => valorBuscar.day == actualDay
      );

      if (queSeaDelDia.length > 0) {
        for (const horario of queSeaDelDia) {
          if (horario.time == horaActual) {
            finalCorreosEnviar.push(correos);
          }

          //Aqui comparo con la hora que guardé
        }
      }
    }

    for (const iterator of finalCorreosEnviar) {
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
        from: iterator.from,
        to: iterator.to,
        subject: iterator.subject,
        html: iterator.html,
      });
    }

    let final = {
      correosEnviados: finalCorreosEnviar,
      diaServidor: actualDay,
      horaServidor: horaActual,
    };

    return NextResponse.json(final, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
