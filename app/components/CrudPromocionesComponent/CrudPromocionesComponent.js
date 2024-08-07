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

const validationSchema = yup.object({
  urlImagen: yup.string("Ingresa").required("Requerido"),
  urlDestino: yup.string("Ingresa").required("Requerido"),
  fechaInicio: yup.string("Ingresa").required("Requerido"),
  fechaFin: yup.string("Ingresa").required("Requerido"),
});

const CrudPromocionesComponent = ({ crud, setCrud, titulo }) => {
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
      urlImagen: crud.type !== "create" ? crud.data.urlImagen : "",
      urlDestino: crud.type !== "create" ? crud.data.urlDestino : "",
      fechaInicio:
        crud.type !== "create"
          ? DateTime.fromISO(crud.data.fechaInicio)
              .setZone("local")
              .toFormat("yyyy-LL-dd'T'HH:mm")
          : "",
      fechaFin:
        crud.type !== "create"
          ? DateTime.fromISO(crud.data.fechaFin)
              .setZone("local")
              .toFormat("yyyy-LL-dd'T'HH:mm")
          : "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setIsDisabled(true);
      values.fechaInicio = values.fechaInicio.replace("T", " ");
      values.fechaFin = values.fechaFin.replace("T", " ");

      if (crud.type == "create") {
        postCreateBannersPrivateApi(values).then((resultado) => {
          if (resultado.status == 200) {
            toast.success("Promoción Creada Correctamente");
            setCrud({ type: null, data: null });
          } else {
            setIsDisabled(false);
            toast.error("Ha ocurrido un error al publicar la promoción");
          }
        });
      }
      if (crud.type == "edit") {
        values.idpromociones = crud.data.idpromociones;
        patchCreateBannersPrivateApi(values).then((resultado) => {
          if (resultado.status == 200) {
            toast.success("Promoción Modificada Correctamente");
            setCrud({ type: null, data: null });
          } else {
            setIsDisabled(false);
            toast.error("Ha ocurrido un error al publicar la promoción");
          }
        });
      }
      if (crud.type == "delete") {
        values.idpromociones = crud.data.idpromociones;

        debugger;
        deleteBannersPrivateApi(crud.data.idpromociones).then((resultado) => {
          if (resultado.status == 200) {
            toast.success("Promoción eliminada correctamente");
            setCrud({ type: null, data: null });
          } else {
            setIsDisabled(false);
            toast.error("Ha ocurrido un error al eliminar la promoción");
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
                  Url Imagen:
                </label>
                <input
                  disabled={crud.type == "delete" ? true : isDisabled}
                  id="urlImagen"
                  name="urlImagen"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.urlImagen}
                  className={`shadow w-full appearance-none border ${
                    formik.errors.urlImagen ? "border-red-500" : ""
                  } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                />
                {formik.errors.urlImagen ? (
                  <p className="text-red-500 text-xs italic">
                    {formik.errors.urlImagen}
                  </p>
                ) : null}
              </div>
              <div className="mb-2">
                <label
                  htmlFor="fieldName"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Url Destino:
                </label>
                <input
                  id="urlDestino"
                  disabled={crud.type == "delete" ? true : isDisabled}
                  name="urlDestino"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.urlDestino}
                  className={`shadow w-full appearance-none border ${
                    formik.errors.urlDestino ? "border-red-500" : ""
                  } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                />
                {formik.errors.urlDestino ? (
                  <p className="text-red-500 text-xs italic">
                    {formik.errors.urlDestino}
                  </p>
                ) : null}
              </div>
              <div className="mb-2">
                <label
                  htmlFor="fieldName"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Fecha Inicio:
                </label>
                <input
                  id="fechaInicio"
                  disabled={crud.type == "delete" ? true : isDisabled}
                  name="fechaInicio"
                  type="datetime-local"
                  onChange={formik.handleChange}
                  value={formik.values.fechaInicio}
                  className={`shadow w-full appearance-none border ${
                    formik.errors.fechaInicio ? "border-red-500" : ""
                  } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                />
                {formik.errors.fechaInicio ? (
                  <p className="text-red-500 text-xs italic">
                    {formik.errors.fechaInicio}
                  </p>
                ) : null}
              </div>
              <div className="mb-2">
                <label
                  htmlFor="fieldName"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Fecha Fin:
                </label>
                <input
                  id="fechaFin"
                  name="fechaFin"
                  disabled={crud.type == "delete" ? true : isDisabled}
                  type="datetime-local"
                  onChange={formik.handleChange}
                  value={formik.values.fechaFin}
                  className={`shadow w-full appearance-none border ${
                    formik.errors.fechaFin ? "border-red-500" : ""
                  } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                />
                {formik.errors.fechaFin ? (
                  <p className="text-red-500 text-xs italic">
                    {formik.errors.fechaFin}
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

export default CrudPromocionesComponent;
