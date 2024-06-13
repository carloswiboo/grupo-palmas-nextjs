"use client";
import { getBannersPrivateApi } from "@/lib/api/apiBanners";
import { useState, useEffect } from "react";
import { DateTime } from "luxon";
import Head from "next/head";
import LoadingDataComponent from "@/app/components/LoadingDataComponent/LoadingDataComponent";
import TitleScreenPageComponent from "@/app/components/TitleScreenPageComponent/TitleScreenPageComponent";
import CrudPromocionesComponent from "@/app/components/CrudPromocionesComponent/CrudPromocionesComponent";

let nombrePlural = "Promociones";
let nombreSingular = "Promoción";
let descripcionPagina = "Se enlistan las promociones de las páginas de Palmas";

export default function Page({ params, searchParams }) {
  const [finalData, setFinalData] = useState([]);
  const [crud, setCrud] = useState({ type: null, data: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBannersPrivateApi().then((resultado) => {
      if (resultado.status == 200) {
        setFinalData(resultado.data);
        setLoading(false);
      } else {
        setFinalData([]);
        setLoading(false);
      }
    });
  }, [crud]);

  return (
    <>
      {loading == true ? (
        <>
          <LoadingDataComponent />
        </>
      ) : null}
      <Head>
        <title> {nombrePlural}</title>
      </Head>

      <TitleScreenPageComponent
        titulo={nombrePlural}
        descripcion={descripcionPagina}
        tituloSingular={nombreSingular}
        crud={crud}
        setCrud={setCrud}
        mostrarAgregar={true}
      />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
        {finalData.map((item) => {
          return (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md overflow-hidden m-3"
            >
              <img src={item.urlImagen} alt={item.urlImagen} />
              <h1>{item.title}</h1>

              <div className=" p-3">
                <ul>
                  <li>
                    <strong>Url:</strong> {item.urlDestino}
                  </li>
                  <li>
                    <strong>Inicia:</strong>{" "}
                    {DateTime.fromISO(item.fechaInicio)
                      .setZone("UTC")
                      .toFormat("f")}
                  </li>
                  <li>
                    <strong>Termina:</strong>{" "}
                    {DateTime.fromISO(item.fechaFin)
                      .setZone("UTC")
                      .toFormat("f")}
                  </li>
                </ul>
              </div>
              <div className="p-3 pt-0">
                <div className=" flex justify-around">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                    onClick={() => setCrud({ type: "edit", data: item })}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full"
                    onClick={() => setCrud({ type: "delete", data: item })}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {crud.type !== null ? (
        <>
          {" "}
          <CrudPromocionesComponent
            crud={crud}
            setCrud={setCrud}
            titulo={nombreSingular}
          />{" "}
        </>
      ) : null}

      {JSON.stringify(crud)}
    </>
  );
}
