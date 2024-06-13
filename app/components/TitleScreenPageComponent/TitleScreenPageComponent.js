import React from "react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
const TitleScreenPageComponent = ({
  titulo,
  descripcion,
  tituloSingular,
  crud,
  setCrud,
  mostrarAgregar,
}) => {
  return (
    <div className="grid grid-cols-2 gap-1 content-center md:grid-cols-2">
      <div>
        <strong> {titulo}</strong> <br /> <small>{descripcion}</small>
      </div>

      {mostrarAgregar == true ? (
        <div className="text-right">
          <button
            type="button"
            onClick={() => setCrud({ type: "create", data: null })}
            className="inline-flex items-center rounded bg-green-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          >
            <CheckCircleIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
            Agregar {tituloSingular}
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default TitleScreenPageComponent;
