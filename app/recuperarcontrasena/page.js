"use client";
import React from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const RecuperarContrasenaPage = () => {
  const [email, setEmail] = React.useState("");
  const [enviado, setEnviado] = React.useState(false);
  const [cargando, setCargando] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Por favor ingresa un correo electrónico válido");
      return;
    }

    setCargando(true);
    try {
      await axios.post("/api/solicitarrecuperacioncontrasena", { usuario: email });
      setEnviado(true);
    } catch (err) {
      setError("Ocurrió un error al procesar la solicitud. Intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      <Toaster />
      <div
        className="min-h-screen flex items-center justify-center px-4 py-12"
        style={{
          backgroundImage: "url('/fondo.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay oscuro */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

        <div className="relative w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl px-8 py-10">
            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <img
                src="https://suzukipalmas.com.mx/assets/suzukiLogo.png"
                alt="Suzuki Palmas"
                className="h-12 w-auto mb-4"
              />
              <h1 className="text-xl font-bold text-gray-900 text-center">
                Recuperar contraseña
              </h1>
              <p className="text-sm text-gray-500 text-center mt-1">
                Administración Grupo Palmas
              </p>
            </div>

            {!enviado ? (
              <>
                <p className="text-sm text-gray-600 text-center mb-6">
                  Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                      Correo electrónico
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(""); }}
                      placeholder="tu@correo.com"
                      className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 focus:outline-none transition-all"
                      disabled={cargando}
                      required
                    />
                    {error && (
                      <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={cargando}
                    className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-all duration-200 shadow-sm"
                  >
                    {cargando ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Enviar instrucciones
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* Estado de éxito */
              <div className="text-center py-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">¡Correo enviado!</h2>
                <p className="text-sm text-gray-500 mb-6">
                  Si existe una cuenta con <strong>{email}</strong>, recibirás un correo con las instrucciones para restablecer tu contraseña.
                </p>
                <p className="text-xs text-gray-400">
                  ¿No lo recibes? Revisa tu carpeta de spam o{" "}
                  <button
                    onClick={() => { setEnviado(false); setEmail(""); }}
                    className="text-red-600 hover:text-red-700 font-semibold underline"
                  >
                    intenta de nuevo
                  </button>
                </p>
              </div>
            )}

            {/* Volver al login */}
            <div className="mt-6 text-center border-t border-gray-100 pt-5">
              <a
                href="/login"
                className="text-sm text-gray-500 hover:text-gray-800 flex items-center justify-center gap-1.5 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver al inicio de sesión
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecuperarContrasenaPage;
