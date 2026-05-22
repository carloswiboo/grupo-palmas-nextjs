"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { Toaster } from "react-hot-toast";


const RestablecerContrasenaInner = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [estado, setEstado] = React.useState("validando"); // validando | formulario | exito | error_token
  const [nuevaContrasena, setNuevaContrasena] = React.useState("");
  const [confirmarContrasena, setConfirmarContrasena] = React.useState("");
  const [mostrarPass, setMostrarPass] = React.useState(false);
  const [mostrarConfirm, setMostrarConfirm] = React.useState(false);
  const [cargando, setCargando] = React.useState(false);
  const [error, setError] = React.useState("");

  // Validar el token al montar el componente
  React.useEffect(() => {
    if (!token) {
      setEstado("error_token");
      return;
    }

    axios
      .get(`/api/restablecercontrasena?token=${token}`)
      .then(() => setEstado("formulario"))
      .catch(() => setEstado("error_token"));
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (nuevaContrasena.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (nuevaContrasena !== confirmarContrasena) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setCargando(true);
    try {
      await axios.post("/api/restablecercontrasena", {
        token,
        nuevaContrasena,
      });
      setEstado("exito");
    } catch (err) {
      setError(
        err?.response?.data?.error || "Ocurrió un error. Intenta de nuevo."
      );
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
                Nueva contraseña
              </h1>
              <p className="text-sm text-gray-500 text-center mt-1">
                Administración Grupo Palmas
              </p>
            </div>

            {/* Estado: validando token */}
            {estado === "validando" && (
              <div className="flex flex-col items-center py-8 gap-3">
                <svg className="w-8 h-8 text-red-500 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <p className="text-sm text-gray-500">Validando enlace...</p>
              </div>
            )}

            {/* Estado: token inválido o expirado */}
            {estado === "error_token" && (
              <div className="text-center py-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">Enlace inválido</h2>
                <p className="text-sm text-gray-500 mb-6">
                  Este enlace para restablecer contraseña es inválido o ya fue utilizado. Solicita uno nuevo.
                </p>
                <a
                  href="/recuperarcontrasena"
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-5 rounded-lg text-sm transition-all duration-200 shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Solicitar nuevo enlace
                </a>
              </div>
            )}

            {/* Estado: formulario activo */}
            {estado === "formulario" && (
              <>
                <p className="text-sm text-gray-600 text-center mb-6">
                  Elige una nueva contraseña segura para tu cuenta.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Nueva contraseña */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Nueva contraseña
                    </label>
                    <div className="relative">
                      <input
                        type={mostrarPass ? "text" : "password"}
                        value={nuevaContrasena}
                        onChange={(e) => { setNuevaContrasena(e.target.value); setError(""); }}
                        placeholder="Mínimo 6 caracteres"
                        className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-10 text-sm text-gray-900 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 focus:outline-none transition-all"
                        disabled={cargando}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setMostrarPass(!mostrarPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        tabIndex={-1}
                      >
                        {mostrarPass ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirmar contraseña */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Confirmar contraseña
                    </label>
                    <div className="relative">
                      <input
                        type={mostrarConfirm ? "text" : "password"}
                        value={confirmarContrasena}
                        onChange={(e) => { setConfirmarContrasena(e.target.value); setError(""); }}
                        placeholder="Repite tu nueva contraseña"
                        className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-10 text-sm text-gray-900 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 focus:outline-none transition-all"
                        disabled={cargando}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setMostrarConfirm(!mostrarConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        tabIndex={-1}
                      >
                        {mostrarConfirm ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Error */}
                  {error && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={cargando}
                    className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-all duration-200 shadow-sm mt-2"
                  >
                    {cargando ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Guardar nueva contraseña
                      </>
                    )}
                  </button>
                </form>
              </>
            )}

            {/* Estado: éxito */}
            {estado === "exito" && (
              <div className="text-center py-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">¡Contraseña actualizada!</h2>
                <p className="text-sm text-gray-500 mb-6">
                  Tu contraseña se ha restablecido correctamente. Ya puedes iniciar sesión con tu nueva contraseña.
                </p>
                <a
                  href="/login"
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-6 rounded-lg text-sm transition-all duration-200 shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Ir al inicio de sesión
                </a>
              </div>
            )}

            {/* Volver al login (solo en formulario activo) */}
            {estado === "formulario" && (
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
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const RestablecerContrasenaPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <svg className="w-8 h-8 text-red-500 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      }
    >
      <Toaster />
      <RestablecerContrasenaInner />
    </Suspense>
  );
};

export default RestablecerContrasenaPage;
