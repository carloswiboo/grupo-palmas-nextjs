"use client";
import React from "react";
import { FcKey } from "react-icons/fc";
const ContentUsuariosComponent = ({ finalData }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {finalData.map((user) => (
          <div
            key={user.idusuario}
            className="bg-white p-4 rounded-lg shadow-md"
          >
            <h2 className="text-xl font-semibold mb-2">
              {user.nombre} {user.apellidopaterno} {user.apellidomaterno}
            </h2>
            <p className="text-gray-600 mb-1">Email: {user.email}</p>
            <p className="text-gray-600 mb-1">
              Fecha de Creación:{" "}
              {new Date(user.creation_date).toLocaleDateString()}
            </p>
            <p className="text-gray-600 mb-1">
              Fecha de Actualización:{" "}
              {new Date(user.update_date).toLocaleDateString()}
            </p>
            <p className="text-gray-600 mb-1">
              Status: {user.status === 1 ? "Activo" : "Inactivo"}
            </p>

            <button
              type="button"
              className="rounded bg-gray-100 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-100"
            >
              <FcKey /> Cambiar Contraseña
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default ContentUsuariosComponent;
