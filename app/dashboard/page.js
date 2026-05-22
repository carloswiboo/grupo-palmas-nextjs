"use client";
import React from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { getMenuPrivateApi } from "@/lib/api/apiMenu";
import ConvertTextToIconComponent from "@/components/ConvertTextToIconComponent";
import {
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  Squares2X2Icon
} from "@heroicons/react/24/outline";

const Home = () => {
  const [anio, setAnio] = React.useState(new Date().getFullYear());
  const [user, setUser] = React.useState({ nombre: "" });
  const [menuPermitido, setMenuPermitido] = React.useState([]);

  React.useEffect(() => {
    // 1. Obtener datos de usuario desde el token JWT
    try {
      const cookieName = process.env.NEXT_PUBLIC_COOKIE_NAME;
      const token = Cookies.get(cookieName);
      if (token) {
        const decoded = jwtDecode(token);
        setUser({
          nombre: decoded.nombre || "Usuario"
        });
      }
    } catch (error) {
      console.error("Error decoding token in dashboard home:", error);
    }

    // 2. Obtener únicamente los accesos autorizados del usuario
    getMenuPrivateApi().then((resultado) => {
      if (resultado.status === 200 && Array.isArray(resultado.data)) {
        // Filtrar enlaces vacíos o raíz para evitar redundancias
        const filtrado = resultado.data.filter(
          (item) => item.enlace && item.enlace !== "/" && item.enlace !== ""
        );
        setMenuPermitido(filtrado);
      }
    }).catch(err => {
      console.error("Error fetching permitted menu:", err);
    });
  }, []);

  return (
    <div className="relative rounded-3xl min-h-[85vh] overflow-hidden flex flex-col items-center justify-start w-full">
      {/* Background layer */}
      <div className="absolute inset-0 z-0 select-none">
        <img
          src="/fondo.jpg"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-50/90 dark:bg-slate-950/80 transition-colors duration-500 backdrop-blur-lg" />
      </div>

      {/* Contenido Central Centrado */}
      <div className="text-center max-w-4xl w-full flex-1 flex flex-col justify-center my-auto z-10 py-10 px-4">
        
        {/* Contenedor del Logo con fondo claro de alto contraste */}
        <div className="inline-block bg-white/95 dark:bg-white rounded-3xl p-4 shadow-2xl mb-6 max-w-[260px] mx-auto border border-white/20 hover:scale-[1.02] transition-transform duration-300">
          <img
            src="/SUZUKI_ANNIVERSARY_20_MEX.webp"
            alt="Suzuki 20 Aniversario México"
            className="h-20 w-auto object-contain mx-auto select-none"
          />
        </div>

        {/* Saludo Personalizado */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold uppercase tracking-wider mx-auto mb-4">
          <SparklesIcon className="w-3.5 h-3.5" />
          Sesión Activa
        </div>

        <h1 className="text-slate-900 dark:text-white text-4xl sm:text-5xl font-black mb-3 tracking-tight transition-colors duration-500">
          ¡Bienvenido de vuelta, <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-500 dark:from-red-500 dark:to-rose-400">{user.nombre || "Administrador"}</span>!
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-lg mb-8 max-w-xl mx-auto font-medium transition-colors duration-500">
          Wiboo &bull; Suzuki Palmas API
        </p>

        {/* Sección Dinámica: Accesos Autorizados */}
        {menuPermitido.length > 0 && (
          <div className="mb-12 w-full">
            <h2 className="text-slate-500 dark:text-white/70 text-xs font-extrabold uppercase tracking-widest mb-6 flex items-center justify-center gap-2 transition-colors duration-500">
              <Squares2X2Icon className="w-4 h-4 text-red-500" />
              Módulos Autorizados para tu Perfil
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto items-stretch">
              {menuPermitido.map((item) => (
                <Link href={"/dashboard" + item.enlace} key={item.idmenu} className="flex animate-fade-in">
                  <div className="group relative flex items-center gap-4 bg-white/70 dark:bg-white/5 hover:bg-white/95 dark:hover:bg-white/10 backdrop-blur-md border border-slate-200 dark:border-white/10 hover:border-red-500/30 p-4 rounded-2xl transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-lg dark:hover:shadow-red-500/5 cursor-pointer text-left w-full h-full min-h-[92px]">
                    <div className="p-2.5 bg-red-800 rounded-xl text-white group-hover:scale-105 transition-transform duration-300 shrink-0">
                      <ConvertTextToIconComponent className="h-5 w-5 shrink-0" textIcon={item.icono} />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h3 className="font-bold text-slate-800 dark:text-white text-sm group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-200 leading-snug">
                        {item.nombre}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5 transition-colors duration-500">
                        Acceder al módulo
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sección Inferior: Botones de Contacto y Soporte */}
      <div className="w-full max-w-3xl border-t border-slate-200 dark:border-white/10 pt-8 mt-auto z-10 pb-10 px-4 transition-colors duration-500">
        <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-widest text-center mb-5 transition-colors duration-500">
          ¿Necesitas soporte técnico o tienes dudas?
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Teléfono de Soporte */}
          <a
            href="tel:+524777522331"
            className="flex items-center justify-center gap-3 bg-white/70 dark:bg-white/5 hover:bg-white/95 dark:hover:bg-white/10 backdrop-blur-sm border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 py-3 px-5 rounded-2xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all duration-300 text-sm font-semibold hover:-translate-y-0.5 shadow-sm"
          >
            <PhoneIcon className="w-5 h-5 text-red-500 shrink-0" />
            <span>Llamar Soporte</span>
          </a>

          {/* Chat de WhatsApp */}
          <a
            href="https://wa.me/524777522331"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 bg-white/70 dark:bg-white/5 hover:bg-white/95 dark:hover:bg-white/10 backdrop-blur-sm border border-slate-200 dark:border-white/10 hover:border-emerald-300 dark:hover:border-emerald-500/30 py-3 px-5 rounded-2xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all duration-300 text-sm font-semibold hover:-translate-y-0.5 shadow-sm"
          >
            <ChatBubbleLeftRightIcon className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>Enviar WhatsApp</span>
          </a>

          {/* Soporte por Correo */}
          <a
            href="mailto:soporte@suzukipalmas.com.mx"
            className="flex items-center justify-center gap-3 bg-white/70 dark:bg-white/5 hover:bg-white/95 dark:hover:bg-white/10 backdrop-blur-sm border border-slate-200 dark:border-white/10 hover:border-rose-300 dark:hover:border-rose-500/30 py-3 px-5 rounded-2xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all duration-300 text-sm font-semibold hover:-translate-y-0.5 shadow-sm"
          >
            <EnvelopeIcon className="w-5 h-5 text-rose-500 shrink-0" />
            <span>Correo Soporte</span>
          </a>
        </div>

        {/* Footer Copyright */}
        <p className="text-slate-400 dark:text-slate-500 text-[10px] text-center mt-8 transition-colors duration-500">
          &copy; {anio} Suzuki Palmas. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
};

export default Home;




