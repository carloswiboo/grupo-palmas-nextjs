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

const validationSchema = yup.object({
  nombre: yup.string("Ingresa").required("Requerido"),
  idanios: yup.string("Ingresa").required("Requerido"),
  frase: yup.string("Ingresa").required("Requerido"),
  imagen: yup.string("Ingresa").required("Requerido"),
  url: yup.string("Ingresa").required("Requerido"),
  pdf: yup.string("Ingresa").required("Requerido"),
  status: yup.string("Ingresa").required("Requerido"),
  orden: yup.string("Ingresa").required("Requerido"),
});

const CrudModelosComponent = ({ crud, setCrud, titulo }) => {
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
      nombre: crud.type !== "create" ? crud.data.nombre : "",
      idanios: crud.type !== "create" ? crud.data.nombre : "",
      frase: crud.type !== "create" ? crud.data.frase : "",
      imagen: crud.type !== "create" ? crud.data.imagen : "",
      url: crud.type !== "create" ? crud.data.url : "",
      pdf: crud.type !== "create" ? crud.data.pdf : "",
      status: crud.type !== "create" ? crud.data.status : "1",
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
                  Año:
                </label>
                <select
                  disabled={crud.type == "delete" ? true : isDisabled}
                  id="idanios"
                  name="idanios"
                  onChange={formik.handleChange}
                  value={formik.values.idanios}
                  className={`shadow w-full appearance-none border ${
                    formik.errors.idanios ? "border-red-500" : ""
                  } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                >
                  <option value="" label="Seleccionar Año" />
                  {finalData.map((item) => {
                    debugger;
                    return (
                      <option
                        key={item.idanios}
                        value={item.idanios}
                        label={item.nombre}
                      />
                    );
                  })}
                </select>
                {formik.errors.idanios ? (
                  <p className="text-red-500 text-xs italic">
                    {formik.errors.idanios}
                  </p>
                ) : null}
              </div>
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
                  Frase:
                </label>
                <input
                  disabled={crud.type == "delete" ? true : isDisabled}
                  id="frase"
                  name="frase"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.frase}
                  className={`shadow w-full appearance-none border ${
                    formik.errors.frase ? "border-red-500" : ""
                  } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                />
                {formik.errors.frase ? (
                  <p className="text-red-500 text-xs italic">
                    {formik.errors.frase}
                  </p>
                ) : null}
              </div>
              <div className="mb-2">
                <label
                  htmlFor="fieldName"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  URL Imagen:
                </label>
                <input
                  disabled={crud.type == "delete" ? true : isDisabled}
                  id="imagen"
                  name="imagen"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.imagen}
                  className={`shadow w-full appearance-none border ${
                    formik.errors.imagen ? "border-red-500" : ""
                  } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                />
                {formik.errors.imagen ? (
                  <p className="text-red-500 text-xs italic">
                    {formik.errors.imagen}
                  </p>
                ) : null}
              </div>
              <div className="mb-2">
                <label
                  htmlFor="fieldName"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  URL Vehículo:
                </label>
                <input
                  disabled={crud.type == "delete" ? true : isDisabled}
                  id="url"
                  name="url"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.url}
                  className={`shadow w-full appearance-none border ${
                    formik.errors.url ? "border-red-500" : ""
                  } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                />
                {formik.errors.url ? (
                  <p className="text-red-500 text-xs italic">
                    {formik.errors.url}
                  </p>
                ) : null}
              </div>
              <div className="mb-2">
                <label
                  htmlFor="fieldName"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  PDF URL:
                </label>
                <input
                  disabled={crud.type == "delete" ? true : isDisabled}
                  id="pdf"
                  name="pdf"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.pdf}
                  className={`shadow w-full appearance-none border ${
                    formik.errors.pdf ? "border-red-500" : ""
                  } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                />
                {formik.errors.pdf ? (
                  <p className="text-red-500 text-xs italic">
                    {formik.errors.pdf}
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

export default CrudModelosComponent;
