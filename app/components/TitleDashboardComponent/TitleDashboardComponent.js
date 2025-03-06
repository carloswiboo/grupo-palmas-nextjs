"use client";
import { useCrudContext } from "@/context/CrudContext";
import React from "react";

import { FaPlus } from "react-icons/fa";
const TitleDashboardComponent = ({
  title = "Sin Título",
  description = "Descripción",
  addButton = true,
}) => {
  const { crud, setCrud } = useCrudContext();

  return (
    <div className="flex justify-between items-center mb-4">
      <div className="max-w-xl">
        <h1
          id="order-history-heading"
          className="text-2xl font-bold tracking-tight text-gray-700"
        >
          {title}
        </h1>
        <p className="mt-2 text-xs text-gray-500">{description}</p>
      </div>

      {addButton && (
        <button
          onClick={() => {
            setCrud({ type: "create", data: {} });
          }}
          className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 cursor-pointer flex items-center text-sm"
        >
          <FaPlus className=" mr-2" /> Agregar
        </button>
      )}
    </div>
  );
};

export default TitleDashboardComponent;
