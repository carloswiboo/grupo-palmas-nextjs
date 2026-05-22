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
  contrasena: Yup.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("La nueva contraseña es obligatoria"),
  confirmContrasena: Yup.string()
    .oneOf([Yup.ref("contrasena"), null], "Las contraseñas deben coincidir")
    .required("Confirma la nueva contraseña"),
});

const CrudActualizarContrasenaUsuariosComponent = () => {
  const [open, setOpen] = useState(true);
  const { crud, setCrud } = useCrudContext();
  const { showLoading, hideLoading } = useLoading();
  const { number, setNumber } = useUpdatedContext();

  const user = crud.data || {};

  const formik = useFormik({
    initialValues: {
      contrasena: "",
      confirmContrasena: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!user.idusuario) {
        toast.error("ID de usuario no válido");
        return;
      }

      showLoading("Actualizando contraseña...");
      try {
        const response = await axios.patch("/api/private/users/updatepassword", {
          idusuario: user.idusuario,
          contrasena: values.contrasena,
        });

        if (response.status === 200) {
          toast.success("Contraseña actualizada correctamente");
          setNumber(number + 1);
          setCrud({ type: null, data: null });
        } else {
          toast.error("Ocurrió un error al actualizar la contraseña");
        }
      } catch (error) {
        toast.error(error.response?.data?.error || "Error al actualizar la contraseña");
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
              className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <form
                onSubmit={formik.handleSubmit}
                className="flex h-full flex-col bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-150 dark:border-gray-800"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-gray-750 to-gray-700 px-6 py-6 sm:px-8 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 text-white">
                      <DialogTitle className="text-xl font-bold tracking-tight">
                        Cambiar Contraseña
                      </DialogTitle>
                      <p className="text-xs text-gray-300 opacity-90">
                        Establece una nueva clave de acceso para el usuario.
                      </p>
                    </div>
                    <div className="flex h-7 items-center">
                      <button
                        type="button"
                        onClick={handleClose}
                        className="relative text-gray-300 hover:text-white rounded-md focus:outline-none transition"
                      >
                        <span className="sr-only">Cerrar</span>
                        <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Form Body */}
                <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 space-y-6">
                  {/* User Profile Card Hint */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-850 rounded-xl border border-gray-100 dark:border-gray-800 flex flex-col gap-1 shadow-sm">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                      Usuario Seleccionado
                    </span>
                    <span className="text-md font-bold text-gray-700 dark:text-gray-200">
                      {user.nombre} {user.apellidopaterno} {user.apellidomaterno}
                    </span>
                    <span className="text-xs text-gray-500">{user.email}</span>
                  </div>

                  {/* Nueva Contraseña */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contrasena"
                      className="block text-sm font-bold text-gray-700 dark:text-gray-300"
                    >
                      Nueva Contraseña:
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

                  {/* Confirmar Contraseña */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="confirmContrasena"
                      className="block text-sm font-bold text-gray-700 dark:text-gray-300"
                    >
                      Confirmar Nueva Contraseña:
                    </label>
                    <input
                      id="confirmContrasena"
                      name="confirmContrasena"
                      type="password"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.confirmContrasena}
                      placeholder="••••••••"
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-750 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 block p-3 transition shadow-sm"
                    />
                    {formik.touched.confirmContrasena && formik.errors.confirmContrasena && (
                      <p className="text-xs text-red-500 font-semibold mt-1">
                        {formik.errors.confirmContrasena}
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
                    className="rounded-lg bg-gray-800 hover:bg-gray-850 dark:bg-red-600 dark:hover:bg-red-700 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:shadow transition"
                  >
                    Actualizar
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

export default CrudActualizarContrasenaUsuariosComponent;
