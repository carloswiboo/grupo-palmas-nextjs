"use client";
import React from "react";

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
          </div>
        ))}
      </div>
    </>
  );
};

export default ContentUsuariosComponent;
