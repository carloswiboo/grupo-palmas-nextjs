"use client";
import { data } from "autoprefixer";
import React from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import {
  deleteBannersPrivateApi,
  patchCreateBannersPrivateApi,
  postCreateBannersPrivateApi,
} from "@/lib/api/apiBanners";
import { toast } from "react-toastify";
import { DateTime } from "luxon";
import {
  deleteAniosPrivateApi,
  patchAniosPrivateApi,
  postCreateAniosPrivateApi,
} from "@/lib/api/apiAnios";

const validationSchema = yup.object({
  nombre: yup.string("Ingresa").required("Requerido"),
});

const CrudAniosComponent = ({ crud, setCrud, titulo }) => {
  const [isDisabled, setIsDisabled] = React.useState(false);

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

  const formik = useFormik({
    initialValues: {
      nombre: crud.type !== "create" ? crud.data.nombre : "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setIsDisabled(true);
      if (crud.type == "create") {
        postCreateAniosPrivateApi(values).then((resultado) => {
          if (resultado.status == 200) {
            toast.success("Año creado correctamente");
            setCrud({ type: null, data: null });
          } else {
            setIsDisabled(false);
            toast.error("Ha ocurrido un error al agregar el año");
          }
        });
      }
      if (crud.type == "edit") {
        values.idanios = crud.data.idanios;
        patchAniosPrivateApi(values).then((resultado) => {
          if (resultado.status == 200) {
            toast.success("Año Modificado Correctamente");
            setCrud({ type: null, data: null });
          } else {
            setIsDisabled(false);
            toast.error("Ha ocurrido un error al modificar el año");
          }
        });
      }
      if (crud.type == "delete") {
        values.idanios = crud.data.idanios;

        debugger;
        deleteAniosPrivateApi(crud.data.idanios).then((resultado) => {
          if (resultado.status == 200) {
            toast.success("Año eliminado correctamente");
            setCrud({ type: null, data: null });
          } else {
            setIsDisabled(false);
            toast.error("Ha ocurrido un error al eliminar el año");
          }
        });
      }

      setIsDisabled(true);
    },
  });

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-end z-50">
        <div
          className="fixed inset-0 bg-black opacity-50"
          onClick={() => setCrud({ type: null, data: null })}
        ></div>

        <form
          onSubmit={formik.handleSubmit}
          className="w-full md:w-1/3 h-full bg-white p-8 overflow-auto transform transition-transform duration-200 ease-in-out flex flex-col justify-between"
        >
          <div>
            <div className="grid grid-cols-2 gap-1 content-center md:grid-cols-2">
              <div>
                <strong>{titulo}</strong>
                <br />
                <strong>
                  <small
                    className={`${
                      crud.type == "create" ? "text-green-500" : null
                    } ${crud.type == "edit" ? "text-blue-500" : null} ${
                      crud.type == "delete" ? "text-red-500" : null
                    } `}
                  >
                    {crud.type == "create" ? "Crear" : null}
                    {crud.type == "edit" ? "Editar" : null}
                    {crud.type == "delete" ? "Eliminar" : null}
                  </small>{" "}
                </strong>
                <br />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-1 content-center md:grid-cols-1 mt-3">
              <div className="mb-2">
                <label
                  htmlFor="fieldName"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Nombre:
                </label>
                <input
                  disabled={crud.type == "delete" ? true : isDisabled}
                  id="nombre"
                  name="nombre"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.nombre}
                  className={`shadow w-full appearance-none border ${
                    formik.errors.nombre ? "border-red-500" : ""
                  } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                />
                {formik.errors.nombre ? (
                  <p className="text-red-500 text-xs italic">
                    {formik.errors.nombre}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={isDisabled}
            className={`px-4 py-2 text-white ${
              crud.type == "create" ? "bg-green-500" : null
            } ${crud.type == "edit" ? "bg-blue-500" : null} ${
              crud.type == "delete" ? "bg-red-500" : null
            } rounded self-end w-full`}
          >
            {crud.type == "create" ? "Crear" : null}
            {crud.type == "edit" ? "Editar" : null}
            {crud.type == "delete" ? "Eliminar" : null} {titulo}
          </button>
        </form>
      </div>
    </>
  );
};

export default CrudAniosComponent;
