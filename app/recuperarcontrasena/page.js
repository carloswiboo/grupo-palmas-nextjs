"use client";
import React from "react";

import { useFormik } from "formik";
import * as Yup from "yup";
import { postLoginUser } from "@/lib/api/apiLogin";
import { toast } from "react-toastify";

const LoginScreenComponent = () => {
  const [cargando, setCargando] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      usuario: "",
    },
    validationSchema: Yup.object({
      usuario: Yup.string()
        .email("Correo electrónico inválido")
        .required("Correo electrónico es requerido"),
      password: Yup.string().required("Contraseña es requerida"),
    }),
    onSubmit: (values) => {
      setCargando(true);
      postLoginUser(values).then((resultado) => {
        if (resultado.status == 200) {
          window.location.reload();
        } else {
          setCargando(false);
          toast.error("Ha ocurrido un error al iniciar la cuenta.");
        }
      });
    },
  });

  return (
    <>
      {cargando == true ? (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 font-light text-white text-center">
          <div>
            <div role="status">
              <svg
                aria-hidden="true"
                class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600 mx-auto"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span class="sr-only">Loading...</span>
              <div className="mt-3">Procesando, espera un poco</div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto w-10 w-auto"
            src="https://suzukipalmas.com.mx/assets/suzukiLogo.png"
            alt="Suzuki Palmas"
          />
          <h2 className="mt-1 text-center text-xl font-bold leading-9 tracking-tight text-gray-900">
            Recuperación de Contraseña
          </h2>
          <h4 className="mt-1 text-center text-sm font-thin tracking-tight text-gray-900">
            Grupo Palmas Administración
          </h4>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Correo Electrónico
              </label>
              <div className="mt-2">
                <input
                  id="usuario"
                  name="usuario"
                  type="email"
                  autoComplete="usuario"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.usuario}
                />
                {formik.touched.email && formik.errors.usuario ? (
                  <div className="text-red-600 text-sm">
                    {formik.errors.usuario}
                  </div>
                ) : null}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                Solicitar correo de Recuperación
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginScreenComponent;
