"use client";
import { DateTime } from "luxon";
import { AxiosAPIGet } from "@/lib/PalmasAPIMethods/AxiosAPIGet";
import React, { useState, useEffect } from "react";
import { useLoading } from "@/context/LoadingContext";
import LoadingDataComponent from "@/app/components/LoadingDataComponent/LoadingDataComponent";

const ReporteLeadsPalmasScreenComponent = () => {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [data, setData] = useState([]);

  const { isLoading, showLoading, hideLoading } = useLoading();

  useEffect(() => {
    const now = DateTime.now();
    setFechaInicio(now.startOf("month").toISODate());
    setFechaFin(now.endOf("month").toISODate());
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    showLoading("Cargando Reporte");

    AxiosAPIGet("https://changanbk.wiboo.mx/ws/contact/getLeads/", {
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
    }).then((response) => {
      hideLoading();
      if (response.status !== 200) {
        setData([]);
        return;
      } else {
        setData(response.data);
      }
    });
  };

  return (
    <>
      {isLoading && <LoadingDataComponent />}
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Reporte de Leads Changan</h1>
        <form
          onSubmit={handleSubmit}
          className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="mb-4">
            <label className="block text-gray-700">Fecha Inicio:</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Fecha Fin:</label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4 flex items-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
            >
              Generar Reporte
            </button>
          </div>
        </form>
        {data.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">Nombre</th>
                  <th className="py-2 px-4 border-b text-left">Teléfono</th>
                  <th className="py-2 px-4 border-b text-left">Correo</th>
                  <th className="py-2 px-4 border-b text-left">Agencia</th>
                  <th className="py-2 px-4 border-b text-left">Vehículo</th>
                  <th className="py-2 px-4 border-b text-left">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {data.map((lead) => (
                  <tr key={lead.id}>
                    <td className="py-2 px-4 border-b text-uppercase">
                      {lead.name} {lead.lastname}
                    </td>
                    <td className="py-2 px-4 border-b">{lead.phone}</td>
                    <td className="py-2 px-4 border-b">{lead.email}</td>
                    <td className="py-2 px-4 border-b">{lead.agency.name}</td>
                    <td className="py-2 px-4 border-b">
                      {lead.contactType.name}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {DateTime.fromISO(lead.createdAt)
                        .setZone("America/Mexico_City")
                        .toLocaleString(DateTime.DATETIME_MED)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default ReporteLeadsPalmasScreenComponent;
