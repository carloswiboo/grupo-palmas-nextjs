"use client";
import { useState, useEffect } from "react";
import { DateTime } from "luxon";
import Head from "next/head";
import LoadingDataComponent from "@/app/components/LoadingDataComponent/LoadingDataComponent";
import TitleScreenPageComponent from "@/app/components/TitleScreenPageComponent/TitleScreenPageComponent";
import CrudPromocionesComponent from "@/app/components/CrudPromocionesComponent/CrudPromocionesComponent";
import { getAniosPrivateApi } from "../../../lib/api/apiAnios";
import CrudAniosComponent from "@/app/components/CrudAniosComponent/CrudAniosComponent";
import { getColoresPrivateApi } from "@/lib/api/apiColores";
import CrudColoresComponent from "@/app/components/CrudColoresComponent/CrudColoresComponent";

let nombrePlural = "Colores";
let nombreSingular = "Color";
let descripcionPagina =
  "Se enlistan los colores posibles de los vehículos de las páginas de Palmas";

export default function Page({ params, searchParams }) {
  const [finalData, setFinalData] = useState([]);
  const [crud, setCrud] = useState({ type: null, data: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getColoresPrivateApi().then((resultado) => {
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
              key={item.idpromociones}
              className="bg-white rounded-xl shadow-md overflow-hidden m-3"
            >
              <div className=" p-3">
                <ul>
                  <li>
                    <strong>Color:</strong> {item.nombre}
                  </li>

                  <li>
                    <strong>Creación:</strong>{" "}
                    {DateTime.fromISO(item.created_at)
                      .setZone("America/Mexico_City")
                      .toFormat("f")}
                  </li>
                  <li>
                    <strong>Actualización:</strong>{" "}
                    {DateTime.fromISO(item.updated_at)
                      .setZone("America/Mexico_City")
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
          <CrudColoresComponent
            crud={crud}
            setCrud={setCrud}
            titulo={nombreSingular}
          />{" "}
        </>
      ) : null}
    </>
  );
}
