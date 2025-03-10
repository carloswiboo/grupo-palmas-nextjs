import TitleScreenPageComponent from "@/app/components/TitleScreenPageComponent/TitleScreenPageComponent";
import Head from "next/head";
import React from "react";

let nombrePlural = "Analytics";
let nombreSingular = "Analytics";
let descripcionPagina = "Se enlistan los reportes de analítica de usuario";

const AnalyticsScreenComponent = () => {
  return (
    <>
      <Head>
        <title> {nombrePlural}</title>
      </Head>

      <TitleScreenPageComponent
        titulo={nombrePlural}
        descripcion={descripcionPagina}
        tituloSingular={nombreSingular}
        crud={null}
        setCrud={null}
        mostrarAgregar={false}
      />

      <div className="w-full h-screen">
        <iframe
          width="100%"
          height="100%"
          src="https://lookerstudio.google.com/embed/reporting/5502924e-474a-47e0-bbdb-34203c2af624/page/kIV1C"
          frameBorder="0"
          style={{ border: 0 }}
          allowFullScreen
          sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        ></iframe>
      </div>
    </>
  );
};

export default AnalyticsScreenComponent;
