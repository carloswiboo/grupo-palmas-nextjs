"use client";

import React, { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useCrudContext } from "@/context/CrudContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLoading } from "@/context/LoadingContext";
import toast from "react-hot-toast";
import { useUpdatedContext } from "@/context/UpdateContext";
import axios from "axios";

const validationSchema = Yup.object({
  nombre: Yup.string().required("El nombre es obligatorio"),
  apellidopaterno: Yup.string().required("El apellido paterno es obligatorio"),
  apellidomaterno: Yup.string().required("El apellido materno es obligatorio"),
  email: Yup.string()
    .email("Dirección de correo no válida")
    .required("El correo electrónico es obligatorio"),
  contrasena: Yup.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("La contraseña es obligatoria"),
});

const CrudUsuariosComponent = () => {
  const [open, setOpen] = useState(true);
  const { setCrud } = useCrudContext();
  const { showLoading, hideLoading } = useLoading();
  const { number, setNumber } = useUpdatedContext();

  const formik = useFormik({
    initialValues: {
      nombre: "",
      apellidopaterno: "",
      apellidomaterno: "",
      email: "",
      contrasena: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      showLoading("Creando usuario...");
      try {
        const response = await axios.post("/api/private/users", values);
        if (response.status === 200) {
          toast.success("Usuario creado correctamente");
          setNumber(number + 1);
          setCrud({ type: null, data: null });
        } else {
          toast.error("Ocurrió un error al crear el usuario");
        }
      } catch (error) {
        toast.error(error.response?.data?.error || "Error al crear el usuario");
        console.error(error);
      } finally {
        hideLoading();
      }
    },
  });

  const handleClose = () => {
    setCrud({ type: null, data: null });
  };

  return (
    <Dialog open={open} onClose={handleClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
            <DialogPanel
              transition
              className="pointer-events-auto w-screen max-w-lg transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <form
                onSubmit={formik.handleSubmit}
                className="flex h-full flex-col bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-100 dark:border-gray-800"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-red-650 to-red-600 px-6 py-6 sm:px-8 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 text-white">
                      <DialogTitle className="text-xl font-bold tracking-tight">
                        Nuevo Usuario
                      </DialogTitle>
                      <p className="text-xs text-red-100 opacity-90">
                        Completa la información para dar de alta una nueva cuenta de acceso.
                      </p>
                    </div>
                    <div className="flex h-7 items-center">
                      <button
                        type="button"
                        onClick={handleClose}
                        className="relative text-red-100 hover:text-white rounded-md focus:outline-none transition"
                      >
                        <span className="sr-only">Cerrar</span>
                        <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Form Body */}
                <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 space-y-5">
                  {/* Nombre */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="nombre"
                      className="block text-sm font-bold text-gray-700 dark:text-gray-300"
                    >
                      Nombre(s):
                    </label>
                    <input
                      id="nombre"
                      name="nombre"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.nombre}
                      placeholder="Ej. Juan Carlos"
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-750 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 block p-3 transition shadow-sm"
                    />
                    {formik.touched.nombre && formik.errors.nombre && (
                      <p className="text-xs text-red-500 font-semibold mt-1">
                        {formik.errors.nombre}
                      </p>
                    )}
                  </div>

                  {/* Apellido Paterno */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="apellidopaterno"
                      className="block text-sm font-bold text-gray-700 dark:text-gray-300"
                    >
                      Apellido Paterno:
                    </label>
                    <input
                      id="apellidopaterno"
                      name="apellidopaterno"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.apellidopaterno}
                      placeholder="Ej. Pérez"
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-750 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 block p-3 transition shadow-sm"
                    />
                    {formik.touched.apellidopaterno && formik.errors.apellidopaterno && (
                      <p className="text-xs text-red-500 font-semibold mt-1">
                        {formik.errors.apellidopaterno}
                      </p>
                    )}
                  </div>

                  {/* Apellido Materno */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="apellidomaterno"
                      className="block text-sm font-bold text-gray-700 dark:text-gray-300"
                    >
                      Apellido Materno:
                    </label>
                    <input
                      id="apellidomaterno"
                      name="apellidomaterno"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.apellidomaterno}
                      placeholder="Ej. Gómez"
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-750 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 block p-3 transition shadow-sm"
                    />
                    {formik.touched.apellidomaterno && formik.errors.apellidomaterno && (
                      <p className="text-xs text-red-500 font-semibold mt-1">
                        {formik.errors.apellidomaterno}
                      </p>
                    )}
                  </div>

                  {/* Correo Electrónico */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="email"
                      className="block text-sm font-bold text-gray-700 dark:text-gray-300"
                    >
                      Correo Electrónico:
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.email}
                      placeholder="correo@ejemplo.com"
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-750 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 block p-3 transition shadow-sm"
                    />
                    {formik.touched.email && formik.errors.email && (
                      <p className="text-xs text-red-500 font-semibold mt-1">
                        {formik.errors.email}
                      </p>
                    )}
                  </div>

                  {/* Contraseña */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contrasena"
                      className="block text-sm font-bold text-gray-700 dark:text-gray-300"
                    >
                      Contraseña Inicial:
                    </label>
                    <input
                      id="contrasena"
                      name="contrasena"
                      type="password"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.contrasena}
                      placeholder="••••••••"
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-750 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 block p-3 transition shadow-sm"
                    />
                    {formik.touched.contrasena && formik.errors.contrasena && (
                      <p className="text-xs text-red-500 font-semibold mt-1">
                        {formik.errors.contrasena}
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="shrink-0 border-t border-gray-250 dark:border-gray-850 px-6 py-5 sm:px-8 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-850 px-4 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-red-600 hover:bg-red-700 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:shadow transition"
                  >
                    Crear Usuario
                  </button>
                </div>
              </form>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default CrudUsuariosComponent;
