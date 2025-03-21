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
  {
    id: 2,
    name: "Contacto Marketing",
    href: "tel:+524771137983",
    initial: "MKT",
    current: false,
  },
  {
    id: 2,
    name: "Contacto Ad's",
    href: "tel:+524776001623",
    initial: "AD'S",
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

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [finalDataMenu, setFinalDataMenu] = React.useState([]);

  const [finalDataUsuario, setFinalDataUsuario] = React.useState({});

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
                    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-blue-950 px-6 pb-4">
                      <div className="flex h-16 shrink-0 items-center">
                        <img
                          className="h-20 w-auto mx-auto mt-2"
                          src="https://suzukipalmas.com.mx/assets/suzukiLogo.png"
                          alt="Your Company"
                        />
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
                                            ? "bg-indigo-700 text-white"
                                            : "text-indigo-200 hover:text-white hover:bg-indigo-700",
                                          "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold cursor-pointer"
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
                            <div className="text-xs font-semibold leading-6 text-indigo-200">
                              Contacto
                            </div>
                            <ul role="list" className="-mx-2 mt-2 space-y-1">
                              {teams.map((team) => (
                                <li key={team.name}>
                                  <a
                                    href={team.href}
                                    className={classNames(
                                      team.current
                                        ? "bg-rose-700 text-white"
                                        : "text-indigo-200 hover:text-white hover:bg-rose-700",
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
                              className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-indigo-200 hover:bg-indigo-700 hover:text-white"
                            >
                              <Cog6ToothIcon
                                className="h-6 w-6 shrink-0 text-indigo-200 group-hover:text-white"
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
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-blue-950 px-6 pb-4">
              <div className="flex h-16 shrink-0 items-center">
                <img
                  className="h-20 w-auto mx-auto mt-2"
                  src="https://suzukipalmas.com.mx/assets/suzukiLogo.png"
                  alt="Your Company"
                />
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
                                    ? "bg-red-800 text-white"
                                    : "text-indigo-200 hover:text-white hover:bg-red-800",
                                  "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold cursor-pointer"
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
                    <div className="text-xs font-semibold leading-6 text-indigo-200">
                      Información
                    </div>
                    <ul role="list" className="-mx-2 mt-2 space-y-1">
                      {teams.map((team) => (
                        <li key={team.name}>
                          <a
                            href={team.href}
                            className={classNames(
                              team.current
                                ? "bg-rose-800 text-white"
                                : "text-indigo-200 hover:text-white hover:bg-rose-800",
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
                      className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-indigo-200 hover:bg-indigo-700 hover:text-white"
                    >
                      <Cog6ToothIcon
                        className="h-6 w-6 shrink-0 text-indigo-200 group-hover:text-white"
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
            <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
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
                      <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                        {userNavigation.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <a
                                href={item.href}
                                className={classNames(
                                  active ? "bg-gray-50" : "",
                                  "block px-3 py-1 text-sm leading-6 text-gray-900"
                                )}
                              >
                                {item.name}
                              </a>
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
              <div className="px-4 sm:px-6 lg:px-8">{children}</div>
            </main>
          </div>
        </div>
        <ToastContainer />
      </AppProvider>
    </>
  );
}
