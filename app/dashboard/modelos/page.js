"use client";
import { useState, useEffect } from "react";
import { DateTime } from "luxon";
import Head from "next/head";
import LoadingDataComponent from "@/app/components/LoadingDataComponent/LoadingDataComponent";
import TitleScreenPageComponent from "@/app/components/TitleScreenPageComponent/TitleScreenPageComponent";
import CrudPromocionesComponent from "@/app/components/CrudPromocionesComponent/CrudPromocionesComponent";
import { getAniosPrivateApi } from "../../../lib/api/apiAnios";
import CrudAniosComponent from "@/app/components/CrudAniosComponent/CrudAniosComponent";
import { getModelosPrivateApi } from "@/lib/api/apiModelos";

let nombrePlural = "Modelos";
let nombreSingular = "Modelo";
let descripcionPagina =
  "Se enlistan los modelos activos en las agencias de Suzuki Palmas";

export default function Page({ params, searchParams }) {
  const [finalData, setFinalData] = useState([]);
  const [crud, setCrud] = useState({ type: null, data: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getModelosPrivateApi().then((resultado) => {
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
      <div className="grid grid-cols-1 md:grid-cols-1 gap-1">
        {finalData.map((item) => {
          return (
            <div
              key={item.idpromociones}
              className="bg-white rounded-xl shadow-md overflow-hidden m-3"
            >
              <div className=" p-3">
                <img
                  style={{ width: "50%", margin: "0 auto" }}
                  src={item.imagen}
                  alt={item.nombre}
                />
                <ul>
                  <li>
                    <strong>Nombre:</strong> {item.nombre}
                  </li>
                  <li>
                    <strong>Año:</strong> {item.anios.nombre}
                  </li>
                  <li>
                    <strong>Frase:</strong>{" "}
                    {item.frase == null ? (
                      <i className=" text-red-600">Sin Frase</i>
                    ) : (
                      item.frase
                    )}
                  </li>
                  <li>
                    <strong>PDF:</strong>{" "}
                    {item.pdf == null ? (
                      <i className=" text-red-600">Sin URL PDF</i>
                    ) : (
                      item.pdf
                    )}
                  </li>
                  <li>
                    <strong>Orden:</strong>{" "}
                    {item.orden == null ? (
                      <i className=" text-red-600">Sin Ordenamiento</i>
                    ) : (
                      item.orden
                    )}
                  </li>

                  <li>
                    <strong>Colores:</strong>
                    {item.colores_modelos.map((color) => {
                      return (
                        <span
                          key={color.idcolores_modelos}
                          className="inline-flex me-2 items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
                        >
                          {color.colores.nombre}
                        </span>
                      );
                    })}
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
                <div className="flex justify-around gap-3">
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
          <CrudAniosComponent
            crud={crud}
            setCrud={setCrud}
            titulo={nombreSingular}
          />{" "}
        </>
      ) : null}
    </>
  );
}
