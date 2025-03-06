"use client";

import ContentUsuariosComponent from "@/app/components/ClientesComponents/ContentUsuariosComponent/ContentUsuariosComponent";
import CrudUsuariosComponent from "@/app/components/ClientesComponents/CrudUsuariosComponent/CrudUsuariosComponent";
import TitleDashboardComponent from "@/app/components/TitleDashboardComponent/TitleDashboardComponent";
import { useCrudContext } from "@/context/CrudContext";
import { useLoading } from "@/context/LoadingContext";
import { useUpdatedContext } from "@/context/UpdateContext";
import { getUsersPrivateApi } from "@/lib/api/apiUsuarios";
import { useState, useEffect } from "react";

let titulo = "Usuarios";
let descripcion = "Listado de usuarios con acceso a la plataforma";

export default function Page({ params, searchParams }) {
  const [finalData, setFinalData] = useState([]);

  const { showLoading, hideLoading, isLoading } = useLoading();

  const { crud, setCrud } = useCrudContext();

  const { number, setNumber } = useUpdatedContext();

  useEffect(() => {
    showLoading("Cargando " + titulo);
    getUsersPrivateApi().then((resultado) => {
      debugger;
      setFinalData(resultado.data);
      hideLoading();
    });
  }, [crud, number, crud]);

  return (
    <div className="p-4">
      <TitleDashboardComponent
        title={titulo}
        description={descripcion}
        addButton={true}
      />

      <ContentUsuariosComponent />

      {crud.type != null && <CrudUsuariosComponent />}
    </div>
  );
}
