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
  getAniosPrivateApi,
  patchAniosPrivateApi,
  postCreateAniosPrivateApi,
} from "@/lib/api/apiAnios";
import { getCategoriasAutosPrivateApi } from "@/lib/api/apiCatergoriaAutos";
import {
  deleteModelosPrivateApi,
  patchModelosPrivateApi,
  postModelosPrivateApi,
} from "@/lib/api/apiModelos";
import {
  deleteStarServicePrivateApi,
  postStarServicePrivateApi,
} from "@/lib/api/apiStarService";

const validationSchema = yup.object({
  nombre: yup.string("Ingresa").required("Requerido"),
  descripcion: yup.string("Ingresa").required("Requerido"),
  iframe: yup.string("Ingresa").required("Requerido"),
  status: yup.string("Ingresa").required("Requerido"),
  idmodelos: yup.string("Ingresa").required("Requerido"),
  orden: yup.string("Ingresa").required("Requerido"),
});

const CrudStarServiceComponent = ({ crud, setCrud, titulo }) => {
  const [isDisabled, setIsDisabled] = React.useState(false);

  const [finalData, setFinalData] = React.useState([]);

  const escFunction = (event) => {
    if (event.keyCode === 27) {
      setCrud({ type: null, data: null });
    }
  };

  React.useEffect(() => {
    getAniosPrivateApi().then((resultado) => {
      if (resultado.status == 200) {
        setFinalData(resultado.data);
      } else {
        setFinalData([]);
      }
    });
  }, []);

  React.useEffect(() => {
    document.addEventListener("keydown", escFunction, false);
    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, []);

  const formik = useFormik({
    initialValues: {
      nombre: "",
      descripcion: "",
      iframe: "",
      status: "1",
      idmodelos: crud.data.idmodelos,
      orden: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setIsDisabled(true);
      if (crud.type == "starService") {
        postStarServicePrivateApi(values).then((resultado) => {
          if (resultado.status == 200) {
            toast.success("Star Service creado correctamente");
            setCrud({ type: null, data: null });
          } else {
            setIsDisabled(false);
            toast.error("Ha ocurrido un error al agregar el Star Service");
          }
        });
      }
      if (crud.type == "edit") {
        values.idmodelos = crud.data.idmodelos;
        patchModelosPrivateApi(values).then((resultado) => {
          if (resultado.status == 200) {
            toast.success("Modelo Modificado Correctamente");
            setCrud({ type: null, data: null });
          } else {
            setIsDisabled(false);
            toast.error("Ha ocurrido un error al modificar el modelo");
          }
        });
      }
      if (crud.type == "delete") {
        values.idanios = crud.data.idanios;

        deleteModelosPrivateApi(crud.data.idmodelos).then((resultado) => {
          if (resultado.status == 200) {
            toast.success("Modelo eliminado correctamente");
            setCrud({ type: null, data: null });
          } else {
            setIsDisabled(false);
            toast.error("Ha ocurrido un error al eliminar el modelo");
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

              <div className="mb-2">
                <label
                  htmlFor="fieldName"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Descripción:
                </label>
                <textarea
                  disabled={crud.type == "delete" ? true : isDisabled}
                  id="descripcion"
                  name="descripcion"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.descripcion}
                  className={`shadow w-full appearance-none border ${
                    formik.errors.descripcion ? "border-red-500" : ""
                  } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                />
                {formik.errors.descripcion ? (
                  <p className="text-red-500 text-xs italic">
                    {formik.errors.descripcion}
                  </p>
                ) : null}
              </div>
              <div className="mb-2">
                <label
                  htmlFor="fieldName"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Iframe o URL
                </label>
                <textarea
                  disabled={crud.type == "delete" ? true : isDisabled}
                  id="iframe"
                  name="iframe"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.iframe}
                  className={`shadow w-full appearance-none border ${
                    formik.errors.iframe ? "border-red-500" : ""
                  } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                />
                {formik.errors.iframe ? (
                  <p className="text-red-500 text-xs italic">
                    {formik.errors.iframe}
                  </p>
                ) : null}
              </div>

              <div className="mb-2">
                <label
                  htmlFor="fieldName"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Orden:
                </label>
                <input
                  disabled={crud.type == "delete" ? true : isDisabled}
                  id="orden"
                  name="orden"
                  type="number"
                  onChange={formik.handleChange}
                  value={formik.values.orden}
                  className={`shadow w-full appearance-none border ${
                    formik.errors.orden ? "border-red-500" : ""
                  } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                />
                {formik.errors.orden ? (
                  <p className="text-red-500 text-xs italic">
                    {formik.errors.orden}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-1 content-center md:grid-cols-1 mt-3">
              {crud.data.starservice.map((item, index) => {
                debugger;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-md overflow-hidden m-3"
                  >
                    <div className="p-3">
                      <h2 className="text-xl font-bold mb-2">{item.nombre}</h2>
                      <p className="text-gray-700 text-base">
                        {item.descripcion}
                      </p>
                      <p className="text-gray-700 text-base">{item.iframe}</p>
                      <p className="text-gray-700 text-base">{item.orden}</p>
                      <button
                        onClick={() => {
                          debugger;
                          setIsDisabled(true);
                          deleteStarServicePrivateApi(item.idstarservice).then(
                            (resultado) => {
                              if (resultado.status == 200) {
                                toast.success(
                                  "Star Service eliminado correctamente"
                                );
                                setCrud({ type: null, data: null });
                              } else {
                                setIsDisabled(false);
                                toast.error(
                                  "Ha ocurrido un error al eliminar el Star Service"
                                );
                              }
                            }
                          );
                        }}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded mt-2"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <button
            type="submit"
            disabled={isDisabled}
            className={`px-4 py-2 text-white ${
              crud.type == "starService" ? "bg-green-500" : null
            } ${crud.type == "edit" ? "bg-blue-500" : null} ${
              crud.type == "delete" ? "bg-red-500" : null
            } rounded self-end w-full`}
          >
            {crud.type == "starService" ? "Crear" : null}
            {crud.type == "edit" ? "Editar" : null}
            {crud.type == "delete" ? "Eliminar" : null} {titulo}
          </button>
        </form>
      </div>
    </>
  );
};

export default CrudStarServiceComponent;
