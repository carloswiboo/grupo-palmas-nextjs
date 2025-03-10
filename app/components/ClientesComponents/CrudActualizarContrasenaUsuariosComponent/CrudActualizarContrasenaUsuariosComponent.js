"use client";

import React from "react";
import { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  LinkIcon,
  PlusIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/20/solid";
import { useCrudContext } from "@/context/CrudContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLoading } from "@/context/LoadingContext";
import toast from "react-hot-toast";
import { useUpdatedContext } from "@/context/UpdateContext";
import { AxiosAPIPost } from "@/lib/PalmasAPIMethods/AxiosAPIPost";
import { AxiosAPIPut } from "@/lib/PalmasAPIMethods/AxiosAPIPut";
import { AxiosAPIDelete } from "@/lib/PalmasAPIMethods/AxiosAPIDelete";

let nombreVista = "Usuarios";
let esMasculino = true;

const validationSchema = Yup.object({
  departamento: Yup.string().required("obligatorio"),
  descripcion: Yup.string(),
});

const CrudActualizarContrasenaUsuariosComponent = (props) => {
  const [open, setOpen] = useState(true);
  const { crud, setCrud } = useCrudContext();
  const [disabled, setDisabled] = useState(false);
  const [colorClases, setColorClases] = useState("");

  const { showLoading, hideLoading, isLoading } = useLoading();

  const { number, setNumber } = useUpdatedContext();

  React.useEffect(() => {
    if (crud.type == "create") {
      setColorClases(
        "bg-green-500 hover:bg-green-500 focus-visible:outline-green-600"
      );
    } else if (crud.type == "update") {
      setColorClases(
        "bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-600"
      );
    } else if (crud.type == "delete") {
      setColorClases(
        "bg-red-500 hover:bg-red-500 focus-visible:outline-red-600"
      );
    } else {
      setColorClases("bg-orange-500");
    }
  }, [crud]);

  //Formik
  const formik = useFormik({
    initialValues: {
      departamento:
        crud.type == "update" || crud.type == "delete"
          ? crud.data.departamento
          : "",
      descripcion:
        crud.type == "update" || crud.type == "delete"
          ? crud.data.descripcion
          : "",
    },
    validationSchema,
    onSubmit: (values) => {
      showLoading();

      if (crud.type == "create") {
        let valuesCreate = {
          departamento: values.departamento,
        };

        AxiosAPIPost("empleados/cDepartamento/nuevo/", {}, values).then(
          (response) => {
            if (response.status === 200) {
              toast.success(
                `${nombreVista} ${
                  esMasculino ? "creado" : "creada"
                } correctamente`
              );
              setNumber(number + 1);
              setCrud({ type: null, data: null }); // Cierra el diálogo después de enviar
              hideLoading();
            } else {
              toast.error(` Ocurrió un error al crear ${nombreVista}`);
              setNumber(number + 1);
              setCrud({ type: null, data: null });
              hideLoading();
            }
          }
        );
      } else if (crud.type == "update") {
        let valuesCreate = {
          departamento: values.departamento,
        };

        AxiosAPIPut(
          "empleados/cDepartamento/editar/" + crud.data.id,
          {},
          values
        ).then((response) => {
          if (response.status === 200) {
            toast.success(
              `${nombreVista} ${
                esMasculino ? "actualizado" : "actualizada"
              } correctamente`
            );
            setNumber(number + 1);
            setCrud({ type: null, data: null }); // Cierra el diálogo después de enviar
            hideLoading();
          } else {
            toast.error(` Ocurrió un error al actualizar ${nombreVista}`);
            setNumber(number + 1);
            setCrud({ type: null, data: null });
            hideLoading();
          }
        });
      } else if (crud.type == "delete") {
        AxiosAPIDelete(
          "empleados/cDepartamento/eliminar/" + crud.data.id,
          {},
          {}
        ).then((response) => {
          if (response.status === 200) {
            toast.success(
              `${nombreVista} ${
                esMasculino ? "eliminado" : "eliminada"
              } correctamente`
            );
            setNumber(number + 1);
            setCrud({ type: null, data: null }); // Cierra el diálogo después de enviar
            hideLoading();
          } else {
            setNumber(number + 1);
            toast.error(` Ocurrió un error al eliminar ${nombreVista}`);
            setCrud({ type: null, data: null });
            hideLoading();
          }
        });
      } else {
        setCrud({ type: null, data: null }); // Cierra el diálogo después de enviar
        console.log("Error: Tipo de operación no definido");
      }

      console.log("Formulario enviado con valores:", values);
    },
  });

  return (
    <>
      <Dialog
        open={open}
        onClose={() => setCrud({ type: null, data: null })}
        className="relative z-50"
      >
        <div className="fixed inset-0" />
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <DialogPanel
                transition
                className="pointer-events-auto w-screen max-w-2xl transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
              >
                <form
                  onSubmit={formik.handleSubmit}
                  className="flex h-full flex-col overflow-y-scroll bg-white dark:bg-gray-800 shadow-xl"
                >
                  <div className="flex-1">
                    {/* Header */}
                    <div className="bg-gray-50 dark:bg-gray-900 px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between space-x-3">
                        <div className="space-y-1">
                          <DialogTitle className="text-base font-semibold text-gray-900 dark:text-white ">
                            {crud.type == "create" && "Crear"}
                            {crud.type == "update" && "Actualizar"}
                            {crud.type == "delete" && "Eliminar"} {nombreVista}
                          </DialogTitle>
                          <p className="text-xs text-gray-500">
                            Ingresa la información para {nombreVista}
                          </p>
                        </div>
                        <div className="flex h-7 items-center">
                          <button
                            type="button"
                            onClick={() => setCrud({ type: null, data: null })}
                            className="relative text-gray-400 hover:text-gray-500"
                          >
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon
                              aria-hidden="true"
                              className="size-6 text-red-500"
                            />
                          </button>
                        </div>
                      </div>
                    </div>

                    {crud.type == "delete" && (
                      <div className="space-y-2 px-4 sm:grid sm:grid-cols-1 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5 items-center">
                        <div
                          class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                          role="alert"
                        >
                          <span class="font-medium">Alerta!</span> Confirma la
                          eliminación del departamento{" "}
                          <strong>{formik.values.departamento}</strong>
                        </div>
                      </div>
                    )}

                    {crud.type != "delete" && (
                      <div className="space-y-6 py-6 sm:space-y-0 sm:divide-y sm:divide-gray-100 dark:divide-none sm:py-0">
                        <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                          <div>
                            <label
                              htmlFor="departamento"
                              className="block text-sm/6 font-medium text-gray-900 dark:text-gray-300 sm:mt-1.5"
                            >
                              Nombre Departamento:
                            </label>
                          </div>
                          <div className="sm:col-span-2">
                            <input
                              id="departamento"
                              name="departamento"
                              type="text"
                              disabled={disabled}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.departamento}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            />
                            {formik.touched.departamento &&
                              formik.errors.departamento && (
                                <p className="text-xs ml-1 mt-2 text-red-500">
                                  {formik.errors.departamento}
                                </p>
                              )}
                          </div>
                        </div>
                        <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                          <div>
                            <label
                              htmlFor="descripcion"
                              className="block text-sm/6 font-medium text-gray-900 dark:text-gray-300 sm:mt-1.5"
                            >
                              Descripción Departamento:
                            </label>
                          </div>
                          <div className="sm:col-span-2">
                            <textarea
                              id="descripcion"
                              name="descripcion"
                              multiple={true}
                              type="text"
                              disabled={disabled}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.descripcion}
                              rows={4}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            />
                            {formik.touched.descripcion &&
                              formik.errors.descripcion && (
                                <p className="text-xs ml-1 mt-2 text-red-500">
                                  {formik.errors.descripcion}
                                </p>
                              )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Divider container */}
                  </div>

                  {/* Action buttons */}
                  <div className="shrink-0 border-t border-gray-200 px-4 py-5 sm:px-6">
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setCrud({ type: null, data: null })}
                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className={`inline-flex justify-center rounded-md  ${colorClases} px-3 py-2 text-sm font-semibold text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 `}
                      >
                        {crud.type == "create" && "Crear"}
                        {crud.type == "update" && "Actualizar"}
                        {crud.type == "delete" && "Eliminar"}
                      </button>
                    </div>
                  </div>
                </form>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default CrudActualizarContrasenaUsuariosComponent;
