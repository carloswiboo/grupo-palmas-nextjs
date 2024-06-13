import { data } from "autoprefixer";
import React from "react";

const CrudPromocionesComponent = ({ crud, setCrud, titulo }) => {
  const escFunction = (event) => {
    if (event.keyCode === 27) {
      setCrud({ type: null, data: null });
    }
  };

  React.useEffect(() => {
    document.addEventListener("keydown", escFunction, false);
    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, []);

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-end z-50">
        <div
          className="fixed inset-0 bg-black opacity-50"
          onClick={() => setCrud({ type: null, data: null })}
        ></div>

        <div className="w-full md:w-1/3 h-full bg-white p-8 overflow-auto transform transition-transform duration-200 ease-in-out">
          <div className="grid grid-cols-2 gap-1 content-center md:grid-cols-2">
            <div>
              <strong>{titulo}</strong>
              <br />
              <small>
                {crud.type == "create" ? "Crear" : null}
                {crud.type == "edit" ? "Editar" : null}
                {crud.type == "delete" ? "Eliminar" : null}
              </small>{" "}
              <br />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CrudPromocionesComponent;
