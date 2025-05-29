"use client";
import { DateTime } from "luxon";
import { AxiosAPIGet } from "@/lib/PalmasAPIMethods/AxiosAPIGet";
import React, { useState, useEffect } from "react";
import { useLoading } from "@/context/LoadingContext";
import LoadingDataComponent from "@/app/components/LoadingDataComponent/LoadingDataComponent";
import * as XLSX from 'xlsx';

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

    AxiosAPIGet("/api/private/getcontacts", {
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
    }).then((response) => {
      hideLoading();
      if (response.status !== 200) {
        setData([]);
        return;
      } else {
        console.log("Datos recibidos:", response.data); // Para ver la estructura real
        setData(response.data);
      }
    });
  };

  const handleDownloadExcel = () => {
    if (data.length === 0) {
      alert('No hay datos para descargar');
      return;
    }

    const excelData = data.map((lead, index) => ({
      'No.': index + 1,
      'Nombre': lead.name || lead.nombre || 'N/A',
      'Teléfono': lead.phone || lead.telefono || 'N/A',
      'Correo': lead.email || lead.correo || 'N/A',
      'Agencia': lead.agency || lead.agencia || 'N/A',
      'Vehículo': lead.vehicle || lead.vehiculo || 'N/A',
      'Fecha': DateTime.fromISO(lead.creacion || lead.created_at || lead.date)
        .setZone("America/Mexico_City")
        .toLocaleString(DateTime.DATETIME_MED)
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads Suzuki');
    
    const fileName = `Reporte_Leads_Suzuki_${DateTime.now().toFormat('yyyy-MM-dd')}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <>
      {isLoading && <LoadingDataComponent />}
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Reporte de Leads Suzuki</h1>
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
          <>
            <div className="mb-4 flex justify-end">
              <button
                onClick={handleDownloadExcel}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Descargar Excel
              </button>
            </div>
            <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 w-[50px]">
                      Nombre
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                      Teléfono
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                      Correo
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                      Agencia
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                      Vehículo
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map((lead, index) => (
                    <tr
                      key={lead.id}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="py-4 px-6 text-sm font-medium text-gray-900 w-[50px] break-words">
                        {lead.name || lead.nombre || 'N/A'}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">
                        {lead.phone || lead.telefono || 'N/A'}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">
                        {lead.email || lead.correo || 'N/A'}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">
                        {lead.agency || lead.agencia || 'N/A'}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">
                        {lead.vehicle || lead.vehiculo || 'N/A'}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">
                        {DateTime.fromISO(lead.creacion || lead.created_at || lead.date)
                          .setZone("America/Mexico_City")
                          .toLocaleString(DateTime.DATETIME_MED)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ReporteLeadsPalmasScreenComponent;
