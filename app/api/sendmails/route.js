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

    // Me traigo la configuración de los smtp
    const result = await prisma.smtp_configuration.findMany({
      where: {
        status: 1,
      },
    });

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
        host: "smtp.office365.com",
        port: 587,
        secure: false,
        auth: {
          user: "carlos@wiboo.com.mx",
          pass: "Sauron.993",
        },
      });

      await transporter.sendMail({
        from: iterator.from,
        to: iterator.to,
        subject: iterator.subject,
        html: iterator.html,
      });
    }

    return NextResponse.json(finalCorreosEnviar, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
