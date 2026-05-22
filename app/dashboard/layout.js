"use client";
import React, { Fragment, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  CalendarIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
  LockClosedIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import Cookies from "js-cookie";
import Link from "next/link";
import * as HeroIcons from "@heroicons/react";
import { getMenuPrivateApi } from "@/lib/api/apiMenu";
import ConvertTextToIconComponent from "@/components/ConvertTextToIconComponent";

import { usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";

import "@shopify/polaris/build/esm/styles.css";

import esTranslations from "@shopify/polaris/locales/es.json";
import { AppProvider } from "@shopify/polaris";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingDataComponent from "../components/LoadingDataComponent/LoadingDataComponent";
import { useLoading } from "@/context/LoadingContext";

const navigation = [
  { name: "Dashboard", href: "#", icon: HomeIcon, current: true },
  { name: "Team", href: "#", icon: UsersIcon, current: false },
  { name: "Projects", href: "#", icon: FolderIcon, current: false },
  { name: "Calendar", href: "#", icon: CalendarIcon, current: false },
  { name: "Documents", href: "#", icon: DocumentDuplicateIcon, current: false },
  { name: "Reports", href: "#", icon: ChartPieIcon, current: false },
];
const teams = [
  {
    id: 1,
    name: "Contacto Web",
    href: "tel:+524777522331",
    initial: "TI",
    current: false,
  },
];
const userNavigation = [
  { name: "Mi perfil", href: "#" },
  { name: "Cerrar Sesión", href: "#" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  const handleLogout = () => {
    Cookies.remove(process.env.NEXT_PUBLIC_COOKIE_NAME);
    window.location.href = "/login";
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  React.useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    }
  };

  const [finalDataMenu, setFinalDataMenu] = React.useState([]);

  const [finalDataUsuario, setFinalDataUsuario] = React.useState({});

  const [isAuthorized, setIsAuthorized] = useState(true);

  const { showLoading, hideLoading, isLoading } = useLoading();

  React.useEffect(() => {
    getMenuPrivateApi().then((resultado) => {
      if (resultado.status == 200) {
        setFinalDataMenu(resultado.data);
      } else {
        setFinalDataMenu([]);
      }
    });
  }, []);

  React.useEffect(() => {
    let nombre = process.env.NEXT_PUBLIC_COOKIE_NAME;

    let hola = Cookies.get(process.env.NEXT_PUBLIC_COOKIE_NAME);
    let decodedToken = jwtDecode(hola);

    setFinalDataUsuario(decodedToken);
  }, []);

  React.useEffect(() => {
    if (finalDataMenu.length === 0) return;

    const subpath = pathname.replace("/dashboard", "");
    if (subpath === "" || subpath === "/") {
      setIsAuthorized(true);
      return;
    }

    const primarySegment = "/" + subpath.split("/").filter(Boolean)[0];

    const isAllowed = finalDataMenu.some(item => {
      if (!item.enlace) return false;
      const menuSegment = "/" + item.enlace.split("/").filter(Boolean)[0];
      return menuSegment === primarySegment;
    });

    const knownScreens = [
      "/analytics",
      "/anios",
      "/banners",
      "/colores",
      "/menuyfunciones",
      "/modelos",
      "/reporteautos",
      "/reporteleadschangan",
      "/reporteleadssuzuki",
      "/usuarios"
    ];

    if (knownScreens.includes(primarySegment)) {
      setIsAuthorized(isAllowed);
    } else {
      setIsAuthorized(true);
    }
  }, [pathname, finalDataMenu]);

  return (
    <>
      <AppProvider i18n={esTranslations}>
        {isLoading && <LoadingDataComponent />}

        <div>
          <Transition.Root show={sidebarOpen} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-50 lg:hidden"
              onClose={setSidebarOpen}
            >
              <Transition.Child
                as={Fragment}
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-gray-900/80" />
              </Transition.Child>

              <div className="fixed inset-0 flex">
                <Transition.Child
                  as={Fragment}
                  enter="transition ease-in-out duration-300 transform"
                  enterFrom="-translate-x-full"
                  enterTo="translate-x-0"
                  leave="transition ease-in-out duration-300 transform"
                  leaveFrom="translate-x-0"
                  leaveTo="-translate-x-full"
                >
                  <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-in-out duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in-out duration-300"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                        <button
                          type="button"
                          className="-m-2.5 p-2.5"
                          onClick={() => setSidebarOpen(false)}
                        >
                          <span className="sr-only">Close sidebar</span>
                          <XMarkIcon
                            className="h-6 w-6 text-white"
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                    </Transition.Child>
                    {/* Sidebar component, swap this element with another sidebar if you like */}
                    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-slate-950 border-r border-gray-200 dark:border-slate-800 px-6 pb-4">
                      <div className="flex h-20 shrink-0 items-center justify-center border-b border-gray-150 dark:border-slate-800 py-3">
                        <div className="bg-white/95 dark:bg-white rounded-xl p-1.5 shadow-md border border-white/20 transition-all duration-300">
                          <img
                            className="h-11 w-auto mx-auto select-none"
                            src="/SUZUKI_ANNIVERSARY_20_MEX.webp"
                            alt="Suzuki Palmas 20 Aniversario"
                          />
                        </div>
                      </div>
                      <nav className="flex flex-1 flex-col">
                        <ul
                          role="list"
                          className="flex flex-1 flex-col gap-y-7"
                        >
                          <li>
                            <ul role="list" className="-mx-2 space-y-1">
                              {finalDataMenu.map((item) => {
                                  let resultado;
                                  if (
                                    pathname == "/dashboard" &&
                                    item.enlace == "/"
                                  ) {
                                    resultado = true;
                                  } else if (item.enlace !== "/") {
                                    resultado = pathname.includes(item.enlace);
                                  }

                                  return (
                                    <li key={item.idmenu}>
                                      <Link href={"/dashboard" + item.enlace}>
                                        <div
                                          className={classNames(
                                            resultado
                                              ? "bg-red-800 text-white shadow-sm"
                                              : "text-slate-600 dark:text-slate-300 hover:text-white hover:bg-red-800",
                                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold cursor-pointer transition-colors duration-200"
                                          )}
                                        >
                                        <ConvertTextToIconComponent
                                          className={`h-6 w-6 shrink-0`}
                                          textIcon={item.icono}
                                        />
                                        {item.nombre}
                                      </div>
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          </li>
                          <li>
                            <div className="text-xs font-semibold leading-6 text-slate-400">
                              Contacto
                            </div>
                            <ul role="list" className="-mx-2 mt-2 space-y-1">
                              {teams.map((team) => (
                                <li key={team.name}>
                                  <a
                                    href={team.href}
                                    className={classNames(
                                      team.current
                                        ? "bg-rose-800 text-white shadow-sm"
                                        : "text-slate-600 hover:text-white hover:bg-rose-800",
                                      "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                    )}
                                  >
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-rose-400 bg-rose-500 text-[0.425rem] font-medium text-white">
                                      {team.initial}
                                    </span>
                                    <span className="truncate">
                                      {team.name}
                                    </span>
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </li>
                          <li className="mt-auto">
                            <a
                              href="#"
                              className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-slate-600 hover:bg-red-800 hover:text-white transition-colors duration-200"
                            >
                              <Cog6ToothIcon
                                className="h-6 w-6 shrink-0 text-slate-400 group-hover:text-white transition-colors duration-200"
                                aria-hidden="true"
                              />
                              Settings
                            </a>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition.Root>

          {/* Static sidebar for desktop */}
          <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
            {/* Sidebar component */}
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-slate-950 border-r border-gray-200 dark:border-slate-800 px-6 pb-4">
              <div className="flex h-20 shrink-0 items-center justify-center border-b border-gray-150 dark:border-slate-800 py-3">
                <div className="bg-white/95 dark:bg-white rounded-xl p-1.5 shadow-md border border-white/20 transition-all duration-300">
                  <img
                    className="h-11 w-auto mx-auto select-none"
                    src="/SUZUKI_ANNIVERSARY_20_MEX.webp"
                    alt="Suzuki Palmas 20 Aniversario"
                  />
                </div>
              </div>
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {finalDataMenu.map((item) => {
                        let resultado;

                        if (pathname == "/dashboard" && item.enlace == "/") {
                          resultado = true;
                        } else if (item.enlace !== "/") {
                          resultado = pathname.includes(item.enlace);
                        }
                        return (
                          <li key={item.idmenu}>
                            <Link href={"/dashboard" + item.enlace}>
                              <div
                                className={classNames(
                                  resultado
                                    ? "bg-red-800 text-white shadow-sm"
                                    : "text-slate-600 dark:text-slate-300 hover:text-white hover:bg-red-800",
                                  "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold cursor-pointer transition-colors duration-200"
                                )}
                              >
                                <ConvertTextToIconComponent
                                  className={`h-6 w-6 shrink-0`}
                                  textIcon={item.icono}
                                />
                                {item.nombre}
                              </div>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                  <li>
                    <div className="text-xs font-semibold leading-6 text-slate-400">
                      Información
                    </div>
                    <ul role="list" className="-mx-2 mt-2 space-y-1">
                      {teams.map((team) => (
                        <li key={team.name}>
                          <a
                            href={team.href}
                            className={classNames(
                              team.current
                                ? "bg-rose-800 text-white shadow-sm"
                                : "text-slate-600 dark:text-slate-300 hover:text-white hover:bg-rose-800",
                              "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                            )}
                          >
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-rose-400 bg-rose-500 text-[0.425rem] font-medium text-white">
                              {team.initial}
                            </span>
                            <span className="truncate">{team.name}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                  <li className="mt-auto">
                    <a
                      href="#"
                      className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300 hover:bg-red-800 hover:text-white transition-colors duration-200"
                    >
                      <Cog6ToothIcon
                        className="h-6 w-6 shrink-0 text-slate-400 group-hover:text-white transition-colors duration-200"
                        aria-hidden="true"
                      />
                      Configuración
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          <div className="lg:pl-72">
            <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* Separator */}
              <div
                className="h-6 w-px bg-gray-900/10 lg:hidden"
                aria-hidden="true"
              />

              <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                <form className="relative flex flex-1" action="#" method="GET">
                  <label htmlFor="search-field" className="sr-only">
                    Buscar
                  </label>
                  <MagnifyingGlassIcon
                    className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <input
                    id="search-field"
                    className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                    placeholder="Buscar"
                    type="search"
                    name="search"
                  />
                </form>
                <div className="flex items-center gap-x-4 lg:gap-x-6">
                  {/* Dark Mode Toggler */}
                  <button
                    type="button"
                    onClick={toggleDarkMode}
                    className="p-2 text-gray-400 hover:text-gray-500 dark:text-slate-400 dark:hover:text-slate-200 transition-all duration-300 transform hover:scale-110 active:scale-95 focus:outline-none"
                    title={darkMode ? "Activar Modo Claro" : "Activar Modo Oscuro"}
                  >
                    <span className="sr-only">Cambiar de modo</span>
                    {darkMode ? (
                      <SunIcon className="h-6 w-6 text-amber-500" aria-hidden="true" />
                    ) : (
                      <MoonIcon className="h-6 w-6 text-slate-500" aria-hidden="true" />
                    )}
                  </button>

                  <button
                    type="button"
                    className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  {/* Separator */}
                  <div
                    className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
                    aria-hidden="true"
                  />

                  {/* Profile dropdown */}
                  <Menu as="div" className="relative">
                    <Menu.Button className="-m-1.5 flex items-center p-1.5">
                      <span className="sr-only">Open user menu</span>

                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-500">
                        <span className="text-sm font-medium leading-none text-white">
                          {finalDataUsuario?.nombre?.charAt(0).toUpperCase()}{" "}
                          {finalDataUsuario?.apellidopaterno
                            ?.charAt(0)
                            .toUpperCase()}{" "}
                        </span>
                      </span>

                      <span className="hidden lg:flex lg:items-center">
                        <span
                          className="ml-4 text-sm font-semibold leading-6 text-gray-900"
                          aria-hidden="true"
                        >
                          {finalDataUsuario.nombre}{" "}
                          {finalDataUsuario.apellidopaterno}{" "}
                        </span>
                        <ChevronDownIcon
                          className="ml-2 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </span>
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white dark:bg-slate-900 py-2 shadow-lg ring-1 ring-gray-900/5 dark:ring-slate-850 focus:outline-none">
                        {userNavigation.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <button
                                type="button"
                                onClick={item.name === "Cerrar Sesión" ? handleLogout : undefined}
                                className={classNames(
                                  active ? "bg-gray-50" : "",
                                  "block w-full text-left px-3 py-1 text-sm leading-6 text-gray-900"
                                )}
                              >
                                {item.name}
                              </button>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>

            <main className="py-10">
              <div className="px-4 sm:px-6 lg:px-8">
                {isAuthorized ? children : (
                  <div className="flex items-center justify-center min-h-[50vh] p-4">
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 max-w-md w-full p-8 text-center">
                      <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-100 shadow-inner">
                        <LockClosedIcon className="h-8 w-8 text-red-700" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 mb-2">Acceso Restringido</h2>
                      <p className="text-gray-500 mb-6 text-sm leading-relaxed">
                        Tu perfil actual no cuenta con autorización para acceder a esta sección. Si consideras que esto es un error, por favor contacta al administrador.
                      </p>
                      <Link href="/dashboard">
                        <div className="inline-block bg-red-800 text-white font-semibold rounded-lg px-6 py-2.5 hover:bg-red-900 transition-colors shadow-sm text-sm cursor-pointer">
                          Volver al Inicio
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
        <ToastContainer />
      </AppProvider>
    </>
  );
}
