"use client";
import { DateTime } from "luxon";
import { AxiosAPIGet } from "@/lib/PalmasAPIMethods/AxiosAPIGet";
import React, { useState, useEffect } from "react";
import { useLoading } from "@/context/LoadingContext";
import LoadingDataComponent from "@/app/components/LoadingDataComponent/LoadingDataComponent";
import * as XLSX from 'xlsx';
import { Card, DonutChart, BarChart, Legend } from "@tremor/react";

const ReporteLeadsAutosScreenComponent = () => {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [data, setData] = useState([]);
  const [viewMode, setViewMode] = useState("table"); // "table" or "cards"
  const [selectedAgencia, setSelectedAgencia] = useState("Todas");
  const [selectedVehiculo, setSelectedVehiculo] = useState("Todos");
  const [showCharts, setShowCharts] = useState(true);

  const { isLoading, showLoading, hideLoading } = useLoading();

  useEffect(() => {
    const now = DateTime.now();
    setFechaInicio(now.startOf("month").toISODate());
    setFechaFin(now.endOf("month").toISODate());
  }, []);

  const handleSubmit = React.useCallback(async (e) => {
    if (e) e.preventDefault();

    showLoading("Cargando Reporte de Autos");

    AxiosAPIGet("/api/private/getleads", {
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
    }).then((response) => {
      hideLoading();
      if (response.status !== 200) {
        setData([]);
        return;
      } else {
        console.log("Datos recibidos:", response.data);
        // Ordenar de más reciente a más antiguo
        const sortedData = (response.data || []).sort((a, b) => {
          const dateA = DateTime.fromISO(a.fecha || "");
          const dateB = DateTime.fromISO(b.fecha || "");
          if (!dateA.isValid) return 1;
          if (!dateB.isValid) return -1;
          return dateB.toMillis() - dateA.toMillis();
        });
        setData(sortedData);
        setSelectedAgencia("Todas");
        setSelectedVehiculo("Todos");
      }
    }).catch((err) => {
      console.error(err);
      hideLoading();
      setData([]);
    });
  }, [fechaInicio, fechaFin, showLoading, hideLoading]);

  // Cargar datos por primera vez al iniciar si ya están configuradas las fechas
  useEffect(() => {
    if (fechaInicio && fechaFin) {
      handleSubmit();
    }
  }, [fechaInicio, fechaFin, handleSubmit]);

  const handleDownloadExcel = () => {
    if (filteredData.length === 0) {
      alert('No hay datos filtrados para descargar');
      return;
    }

    const excelData = filteredData.map((lead, index) => ({
      'No.': index + 1,
      'Nombre': lead.nombre || 'N/A',
      'Teléfono': lead.telefono || 'N/A',
      'Correo': lead.correo || 'N/A',
      'Agencia': lead.agencia || 'N/A',
      'Vehículo': lead.vehiculo || 'N/A',
      'Razón de Contacto': lead.razon || 'N/A',
      'Notas/Mensaje': lead.notas || 'Sin notas',
      'Fecha': DateTime.fromISO(lead.fecha)
        .setZone("America/Mexico_City")
        .toLocaleString(DateTime.DATETIME_MED)
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads de Autos');
    
    const fileName = `Reporte_Leads_Autos_${DateTime.now().toFormat('yyyy-MM-dd')}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  // Filtrado en tiempo real
  const agencies = ["Todas", ...Array.from(new Set(data.map(lead => lead.agencia).filter(Boolean)))];
  const vehicles = ["Todos", ...Array.from(new Set(data.map(lead => lead.vehiculo).filter(Boolean)))];

  const filteredData = data.filter(lead => {
    const matchAgencia = selectedAgencia === "Todas" || lead.agencia === selectedAgencia;
    const matchVehiculo = selectedVehiculo === "Todos" || lead.vehiculo === selectedVehiculo;
    return matchAgencia && matchVehiculo;
  });

  // 1. Datos para Gráfica de Dona: Contactos por Agencia
  const agencyCounts = {};
  data.forEach((lead) => {
    const agency = lead.agencia || "N/A";
    agencyCounts[agency] = (agencyCounts[agency] || 0) + 1;
  });

  const agencyChartData = Object.keys(agencyCounts).map((agency) => ({
    name: agency,
    value: agencyCounts[agency],
  }));

  // 2. Datos para Gráfica de Barras Apiladas: Modelos de Vehículos por Agencia
  const uniqueVehiclesForChart = Array.from(
    new Set(data.map((lead) => lead.vehiculo).filter(Boolean))
  );

  const uniqueAgenciesForChart = Array.from(
    new Set(data.map((lead) => lead.agencia).filter(Boolean))
  );

  const agencyVehicleChartData = uniqueAgenciesForChart.map((agency) => {
    const row = { agency };
    uniqueVehiclesForChart.forEach((v) => {
      row[v] = 0;
    });
    data.forEach((lead) => {
      if (lead.agencia === agency) {
        const v = lead.vehiculo;
        if (v) {
          row[v] = (row[v] || 0) + 1;
        }
      }
    });
    return row;
  });

  return (
    <>
      {isLoading && <LoadingDataComponent />}
      <div className="p-4 space-y-6">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 dark:border-slate-800 pb-5">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Reporte Leads de Autos
            </h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              Consolidado e informes detallados sobre leads registrados directamente en el sitio web de Grupo Palmas.
            </p>
          </div>
        </div>

        {/* Filtros de Fecha */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800/80 shadow-sm rounded-xl p-5">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-end"
          >
            <div>
              <label className="block text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                Fecha Inicio:
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700/60 p-3 rounded-lg text-sm text-gray-800 dark:text-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                Fecha Fin:
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700/60 p-3 rounded-lg text-sm text-gray-800 dark:text-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-sm transition-all duration-200 shadow-md transform hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                Actualizar Reporte
              </button>
            </div>
          </form>
        </div>

        {data.length > 0 ? (
          <>
            {/* Barra de Control, Filtrado en Tiempo Real y Exportación */}
            <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 bg-gray-50/60 dark:bg-slate-800/20 p-4 rounded-xl border border-gray-200/60 dark:border-slate-800/60">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 flex-wrap">
                {/* Toggler de Vista */}
                <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-lg border border-gray-200/60 dark:border-slate-700/50 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setViewMode("table")}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                      viewMode === "table"
                        ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm border border-gray-200/20"
                        : "text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-200"
                    }`}
                  >
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
                    </svg>
                    <span>Vista Tabla</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("cards")}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                      viewMode === "cards"
                        ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm border border-gray-200/20"
                        : "text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-200"
                    }`}
                  >
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z" />
                    </svg>
                    <span>Vista Tarjetas</span>
                  </button>
                </div>

                {/* Toggler de Gráficas */}
                <button
                  type="button"
                  onClick={() => setShowCharts(!showCharts)}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-200 shadow-sm w-full sm:w-auto ${
                    showCharts
                      ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50"
                      : "bg-white dark:bg-slate-900 text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-200 border-gray-200 dark:border-slate-800"
                  }`}
                >
                  <svg className={`w-4 h-4 shrink-0 transition-transform duration-200 ${showCharts ? "scale-110" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
                  </svg>
                  <span>{showCharts ? "Ocultar Gráficas" : "Ver Gráficas"}</span>
                </button>

                {/* Filtro por Agencia */}
                <div className="flex items-center gap-2 w-full sm:w-64 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 px-3 py-1.5 rounded-lg shadow-sm">
                  <svg className="w-5 h-5 text-gray-400 dark:text-slate-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.778.099-1.533.284-2.253" />
                  </svg>
                  <span className="text-xs font-bold text-gray-400 dark:text-slate-500 shrink-0 uppercase tracking-wider">Agencia:</span>
                  <select
                    value={selectedAgencia}
                    onChange={(e) => setSelectedAgencia(e.target.value)}
                    className="w-full bg-transparent border-0 p-0 text-sm text-gray-800 dark:text-slate-200 font-semibold focus:ring-0 focus:outline-none cursor-pointer"
                  >
                    {agencies.map((agency) => (
                      <option key={agency} value={agency} className="bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-200">
                        {agency}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filtro por Modelo/Vehiculo */}
                <div className="flex items-center gap-2 w-full sm:w-64 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 px-3 py-1.5 rounded-lg shadow-sm">
                  <svg className="w-5 h-5 text-gray-400 dark:text-slate-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.129-1.125v-3.75m-17.25 0h16.5V9.75c0-.621-.504-1.125-1.125-1.125h-9.75L9 3.75H4.875c-.621 0-1.125.504-1.125 1.125v9.375c0 .621.504 1.125 1.125 1.125z" />
                  </svg>
                  <span className="text-xs font-bold text-gray-400 dark:text-slate-500 shrink-0 uppercase tracking-wider">Modelo:</span>
                  <select
                    value={selectedVehiculo}
                    onChange={(e) => setSelectedVehiculo(e.target.value)}
                    className="w-full bg-transparent border-0 p-0 text-sm text-gray-800 dark:text-slate-200 font-semibold focus:ring-0 focus:outline-none cursor-pointer"
                  >
                    {vehicles.map((v) => (
                      <option key={v} value={v} className="bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-200">
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Botón Excel */}
              <button
                type="button"
                onClick={handleDownloadExcel}
                className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 font-semibold transition-all duration-200 transform hover:scale-[1.01] active:scale-95 shadow-md shrink-0 cursor-pointer"
              >
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Descargar Excel</span>
              </button>
            </div>

            {/* Panel de Gráficas */}
            {showCharts && (
              <div className="transition-all duration-300 ease-in-out">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Tarjeta 1: Distribución por Agencia */}
                  <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800/80 shadow-md rounded-xl p-5 flex flex-col justify-between min-h-[350px]">
                    <div>
                      <h3 className="text-sm font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                        Distribución por Agencia
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mb-4">
                        Porcentaje y total de leads de autos capturados en el periodo.
                      </p>
                    </div>
                    {agencyChartData.length > 0 ? (
                      <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center justify-around gap-4 my-auto">
                        <DonutChart
                          data={agencyChartData}
                          category="value"
                          index="name"
                          valueFormatter={(number) => `${number} leads`}
                          colors={["blue", "cyan", "emerald", "amber", "rose", "indigo", "violet"]}
                          className="w-36 h-36 shrink-0"
                          showAnimation={true}
                        />
                        <div className="flex flex-col gap-1 max-w-full overflow-hidden">
                          <Legend
                            categories={agencyChartData.map(item => item.name)}
                            colors={["blue", "cyan", "emerald", "amber", "rose", "indigo", "violet"]}
                            className="max-w-xs"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-48 text-sm text-gray-400">
                        Sin datos de agencias
                      </div>
                    )}
                  </div>

                  {/* Tarjeta 2: Interés de Modelos por Agencia */}
                  <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800/80 shadow-md rounded-xl p-5 flex flex-col justify-between min-h-[350px]">
                    <div>
                      <h3 className="text-sm font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                        Modelos de Interés por Agencia
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mb-4">
                        Desglose acumulado de vehículos consultados por cada sucursal.
                      </p>
                    </div>
                    {agencyVehicleChartData.length > 0 && uniqueVehiclesForChart.length > 0 ? (
                      <div className="flex-1 min-h-[220px]">
                        <BarChart
                          className="h-60 mt-2"
                          data={agencyVehicleChartData}
                          index="agency"
                          categories={uniqueVehiclesForChart}
                          colors={["blue", "teal", "amber", "rose", "emerald", "violet", "indigo", "cyan", "lime", "orange", "pink", "sky", "fuchsia", "purple"]}
                          valueFormatter={(number) => `${number} leads`}
                          yAxisWidth={40}
                          stack={true}
                          showAnimation={true}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-48 text-sm text-gray-400">
                        Sin datos de vehículos de interés
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Vistas de Resultados */}
            {filteredData.length > 0 ? (
              viewMode === "table" ? (
                /* Vista de Tabla */
                <div className="overflow-x-auto shadow-lg rounded-xl border border-gray-200/80 dark:border-slate-800">
                  <table className="min-w-full bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-slate-800">
                    <thead className="bg-gray-50 dark:bg-slate-800">
                      <tr>
                        <th className="py-3.5 px-6 text-left text-xs font-semibold text-gray-500 dark:text-slate-300 uppercase tracking-wider border-b border-gray-200 dark:border-slate-800 min-w-[160px]">
                          Nombre / Razón
                        </th>
                        <th className="py-3.5 px-6 text-left text-xs font-semibold text-gray-500 dark:text-slate-300 uppercase tracking-wider border-b border-gray-200 dark:border-slate-800 min-w-[150px]">
                          Teléfono
                        </th>
                        <th className="py-3.5 px-6 text-left text-xs font-semibold text-gray-500 dark:text-slate-300 uppercase tracking-wider border-b border-gray-200 dark:border-slate-800 min-w-[180px]">
                          Correo
                        </th>
                        <th className="py-3.5 px-6 text-left text-xs font-semibold text-gray-500 dark:text-slate-300 uppercase tracking-wider border-b border-gray-200 dark:border-slate-800 min-w-[120px]">
                          Agencia
                        </th>
                        <th className="py-3.5 px-6 text-left text-xs font-semibold text-gray-500 dark:text-slate-300 uppercase tracking-wider border-b border-gray-200 dark:border-slate-800 min-w-[120px]">
                          Vehículo
                        </th>
                        <th className="py-3.5 px-6 text-left text-xs font-semibold text-gray-500 dark:text-slate-300 uppercase tracking-wider border-b border-gray-200 dark:border-slate-800 min-w-[180px]">
                          Mensaje / Notas
                        </th>
                        <th className="py-3.5 px-6 text-left text-xs font-semibold text-gray-500 dark:text-slate-300 uppercase tracking-wider border-b border-gray-200 dark:border-slate-800 min-w-[150px]">
                          Fecha
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-slate-800">
                      {filteredData.map((lead, index) => {
                        const rawPhone = lead.telefono;
                        const cleanPhone = rawPhone ? rawPhone.replace(/\D/g, "") : "";
                        const whatsappUrl = cleanPhone.length === 10 ? `https://wa.me/52${cleanPhone}` : `https://wa.me/${cleanPhone}`;
                        const rawEmail = lead.correo;

                        return (
                          <tr
                            key={lead.id || index}
                            className={index % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-gray-50 dark:bg-slate-800/40"}
                          >
                            <td className="py-4 px-6 text-sm font-semibold text-gray-900 dark:text-slate-100 min-w-[160px]">
                              <div>{lead.nombre || "N/A"}</div>
                              <span className="inline-block text-[10px] uppercase font-bold text-gray-400 dark:text-slate-500 tracking-wider">
                                {lead.razon || "Contacto"}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-500 dark:text-slate-400 whitespace-nowrap">
                              {rawPhone && rawPhone !== "N/A" ? (
                                <div className="flex items-center gap-3">
                                  <a
                                    href={`tel:${rawPhone}`}
                                    className="text-emerald-600 dark:text-emerald-400 hover:underline hover:text-emerald-800 dark:hover:text-emerald-300 font-medium transition-colors flex items-center gap-1.5"
                                    title="Llamar al número"
                                  >
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.802-5.183-4.162-6.985-6.985l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                    </svg>
                                    <span>{rawPhone}</span>
                                  </a>
                                  {cleanPhone && (
                                    <a
                                      href={whatsappUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-emerald-500 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300 transition-all transform hover:scale-110 active:scale-95"
                                      title="Enviar WhatsApp"
                                    >
                                      <svg className="w-5 h-5 shrink-0 fill-current" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.022-.079-.185-.285-.438-.413-.253-.127-1.495-.738-1.728-.822-.232-.085-.402-.128-.569.128-.168.256-.649.822-.796.993-.148.17-.294.191-.547.064-.253-.127-1.07-.394-2.036-1.259-.75-.669-1.257-1.494-1.405-1.748-.148-.254-.016-.392.111-.518.115-.113.253-.297.38-.445.127-.148.17-.253.253-.422.083-.17.042-.319-.021-.447-.064-.127-.569-1.371-.78-1.879-.205-.494-.41-.426-.569-.434-.146-.007-.314-.008-.483-.008-.168 0-.443.064-.674.316-.232.253-.884.864-.884 2.109 0 1.245.906 2.447.98 2.548.074.102 1.776 2.712 4.302 3.801.601.258 1.07.412 1.435.529.602.192 1.15.165 1.583.101.482-.072 1.495-.611 1.706-1.202.21-.591.21-1.099.148-1.202-.061-.101-.225-.164-.478-.291zM12.016 22.006c-1.82 0-3.601-.486-5.16-1.408l-.371-.22-3.841.979 1.002-3.7-.246-.388c-.991-1.572-1.517-3.385-1.517-5.263 0-5.46 4.468-9.907 9.928-9.907 2.643 0 5.126 1.026 6.998 2.898 1.87 1.871 2.9 4.351 2.9 6.999 0 5.46-4.468 9.909-9.934 9.909zM22.008 11.986c0-2.671-1.042-5.183-2.934-7.075-1.892-1.891-4.406-2.933-7.078-2.933-5.508 0-9.988 4.48-9.988 9.988 0 1.93.558 3.816 1.615 5.433l-1.716 6.331 6.5-.1.01.005c1.554.852 3.3.13 4.887.13 5.512 0 9.998-4.48 9.998-9.989z"/>
                                      </svg>
                                    </a>
                                  )}
                                </div>
                              ) : (
                                "N/A"
                              )}
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-500 dark:text-slate-400 whitespace-nowrap">
                              {rawEmail && rawEmail !== "N/A" ? (
                                <a
                                  href={`mailto:${rawEmail}`}
                                  className="text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
                                  title="Enviar correo"
                                >
                                  {rawEmail}
                                </a>
                              ) : (
                                "N/A"
                              )}
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-500 dark:text-slate-400 whitespace-nowrap">
                              {lead.agencia || "N/A"}
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-500 dark:text-slate-400 whitespace-nowrap font-medium text-gray-700 dark:text-slate-300">
                              {lead.vehiculo || "N/A"}
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-500 dark:text-slate-400 max-w-xs truncate" title={lead.notas}>
                              {lead.notas || <span className="text-gray-300 dark:text-slate-700 italic">Sin notas</span>}
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-500 dark:text-slate-400 whitespace-nowrap">
                              {DateTime.fromISO(lead.fecha)
                                .setZone("America/Mexico_City")
                                .toLocaleString(DateTime.DATETIME_MED)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                /* Vista de Tarjetas */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredData.map((lead, index) => {
                    const rawPhone = lead.telefono;
                    const cleanPhone = rawPhone ? rawPhone.replace(/\D/g, "") : "";
                    const whatsappUrl = cleanPhone.length === 10 ? `https://wa.me/52${cleanPhone}` : `https://wa.me/${cleanPhone}`;
                    const rawEmail = lead.correo;

                    return (
                      <div
                        key={lead.id || index}
                        className="bg-white dark:bg-slate-900 shadow-md rounded-xl p-5 border border-gray-200 dark:border-slate-800 hover:shadow-lg dark:hover:shadow-slate-950/30 transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between"
                      >
                        <div>
                          {/* Header: Nombre y Agencia */}
                          <div className="flex justify-between items-start gap-2 mb-3">
                            <div>
                              <h3 className="text-base font-bold text-gray-900 dark:text-slate-100 line-clamp-1">
                                {lead.nombre || "N/A"}
                              </h3>
                              <span className="inline-block text-[9px] uppercase font-bold text-gray-400 dark:text-slate-500 tracking-wider">
                                {lead.razon || "Contacto"}
                              </span>
                            </div>
                            <span className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-100 dark:border-blue-800/30">
                              {lead.agencia || "N/A"}
                            </span>
                          </div>

                          {/* Vehículo Interés */}
                          <div className="flex items-center gap-2 mb-4 bg-gray-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-gray-100 dark:border-slate-800/30">
                            <svg className="w-4 h-4 text-gray-500 dark:text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.129-1.125v-3.75m-17.25 0h16.5V9.75c0-.621-.504-1.125-1.125-1.125h-9.75L9 3.75H4.875c-.621 0-1.125.504-1.125 1.125v9.375c0 .621.504 1.125 1.125 1.125z" />
                            </svg>
                            <div className="text-xs">
                              <span className="text-gray-500 dark:text-slate-400">Modelo Interés: </span>
                              <span className="font-semibold text-gray-800 dark:text-slate-200">{lead.vehiculo || "N/A"}</span>
                            </div>
                          </div>

                          {/* Datos de Contacto */}
                          <div className="space-y-2.5 text-sm mb-4">
                            {/* Teléfono y WhatsApp */}
                            <div className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.802-5.183-4.162-6.985-6.985l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                </svg>
                                {rawPhone && rawPhone !== "N/A" ? (
                                  <a
                                    href={`tel:${rawPhone}`}
                                    className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                                    title="Llamar"
                                  >
                                    {rawPhone}
                                  </a>
                                ) : (
                                  <span className="text-gray-400">N/A</span>
                                )}
                              </div>
                              {rawPhone && rawPhone !== "N/A" && cleanPhone && (
                                <a
                                  href={whatsappUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-emerald-500 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300 p-1 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded-md transition-all transform hover:scale-110"
                                  title="Enviar WhatsApp"
                                >
                                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.022-.079-.185-.285-.438-.413-.253-.127-1.495-.738-1.728-.822-.232-.085-.402-.128-.569.128-.168.256-.649.822-.796.993-.148.17-.294.191-.547.064-.253-.127-1.07-.394-2.036-1.259-.75-.669-1.257-1.494-1.405-1.748-.148-.254-.016-.392.111-.518.115-.113.253-.297.38-.445.127-.148.17-.253.253-.422.083-.17.042-.319-.021-.447-.064-.127-.569-1.371-.78-1.879-.205-.494-.41-.426-.569-.434-.146-.007-.314-.008-.483-.008-.168 0-.443.064-.674.316-.232.253-.884.864-.884 2.109 0 1.245.906 2.447.98 2.548.074.102 1.776 2.712 4.302 3.801.601.258 1.07.412 1.435.529.602.192 1.15.165 1.583.101.482-.072 1.495-.611 1.706-1.202.21-.591.21-1.099.148-1.202-.061-.101-.225-.164-.478-.291zM12.016 22.006c-1.82 0-3.601-.486-5.16-1.408l-.371-.22-3.841.979 1.002-3.7-.246-.388c-.991-1.572-1.517-3.385-1.517-5.263 0-5.46 4.468-9.907 9.928-9.907 2.643 0 5.126 1.026 6.998 2.898 1.87 1.871 2.9 4.351 2.9 6.999 0 5.46-4.468 9.909-9.934 9.909zM22.008 11.986c0-2.671-1.042-5.183-2.934-7.075-1.892-1.891-4.406-2.933-7.078-2.933-5.508 0-9.988 4.48-9.988 9.988 0 1.93.558 3.816 1.615 5.433l-1.716 6.331 6.5-.1.01.005c1.554.852 3.3.13 4.887.13 5.512 0 9.998-4.48 9.998-9.989z"/>
                                  </svg>
                                </a>
                              )}
                            </div>

                            {/* Correo Electrónico */}
                            <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors overflow-hidden">
                              <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                              </svg>
                              {rawEmail && rawEmail !== "N/A" ? (
                                <a
                                  href={`mailto:${rawEmail}`}
                                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium truncate"
                                  title="Enviar correo"
                                >
                                  {rawEmail}
                                </a>
                              ) : (
                                <span className="text-gray-400">N/A</span>
                              )}
                            </div>
                          </div>

                          {/* Notas o Mensaje en tarjeta */}
                          {lead.notas && (
                            <div className="mb-4 bg-amber-50/40 dark:bg-slate-800/40 p-3 rounded-lg border border-amber-100/40 dark:border-slate-800/60">
                              <span className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Notas del Lead:</span>
                              <p className="text-xs text-gray-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                                {lead.notas}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Footer de Tarjeta: Fecha */}
                        <div className="border-t border-gray-150 dark:border-slate-800/80 pt-3.5 mt-1 flex justify-between items-center text-xs text-gray-500 dark:text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                            </svg>
                            <span>
                              {DateTime.fromISO(lead.fecha)
                                .setZone("America/Mexico_City")
                                .toLocaleString(DateTime.DATETIME_MED)}
                            </span>
                          </div>
                          <span className="text-gray-300 dark:text-slate-700 font-semibold">#{index + 1}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-12 text-center shadow-md">
                <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 text-gray-400 dark:text-slate-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200/60 dark:border-slate-800">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Sin resultados de coincidencia</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 max-w-sm mx-auto">
                  No se encontraron leads con la combinación de filtros seleccionada para Agencia: <strong className="text-blue-600 dark:text-blue-400">&quot;{selectedAgencia}&quot;</strong> y Modelo: <strong className="text-blue-600 dark:text-blue-400">&quot;{selectedVehiculo}&quot;</strong>.
                </p>
              </div>
            )}
          </>
        ) : (
          /* Estado vacío / Cargado inicial vacío */
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-16 text-center shadow-md">
            <div className="w-20 h-20 bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-100 dark:border-blue-900/30">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No se encontraron registros de leads</h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 max-w-md mx-auto mb-6">
              No se han encontrado registros de contactos para el rango de fechas seleccionado ({DateTime.fromISO(fechaInicio).toLocaleString(DateTime.DATE_MED)} - {DateTime.fromISO(fechaFin).toLocaleString(DateTime.DATE_MED)}).
            </p>
            <div className="text-xs text-slate-400 dark:text-slate-500">
              Prueba modificando las fechas de búsqueda arriba.
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ReporteLeadsAutosScreenComponent;
