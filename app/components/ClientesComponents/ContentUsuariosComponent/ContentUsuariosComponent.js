"use client";
import React, { useState, useEffect } from "react";
import { FcKey } from "react-icons/fc";
import { FaTrash } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import ConvertTextToIconComponent from "@/components/ConvertTextToIconComponent";

const ContentUsuariosComponent = ({ finalData }) => {
  const [localUsers, setLocalUsers] = useState(finalData);
  const [currentUser, setCurrentUser] = useState(null);
  const [availableMenus, setAvailableMenus] = useState([]);
  const [userPermissions, setUserPermissions] = useState({}); // { [idusuario]: [idmenu, idmenu, ...] }
  const [expandedUser, setExpandedUser] = useState(null);
  const [loadingPermisos, setLoadingPermisos] = useState(false);

  useEffect(() => {
    setLocalUsers(finalData);
  }, [finalData]);

  useEffect(() => {
    try {
      const token = Cookies.get(process.env.NEXT_PUBLIC_COOKIE_NAME);
      if (token) {
        const decoded = jwtDecode(token);
        setCurrentUser(decoded);
      }
    } catch (e) {
      console.error("Error decoding token in ContentUsuariosComponent:", e);
    }
  }, []);

  const handleToggleExpand = async (idusuario) => {
    if (expandedUser === idusuario) {
      setExpandedUser(null);
      return;
    }

    setExpandedUser(idusuario);

    // Si aún no hemos cargado los permisos para este usuario, los traemos
    if (!userPermissions[idusuario]) {
      setLoadingPermisos(true);
      try {
        const response = await axios.get(`/api/private/users/permisos?idusuario=${idusuario}`);
        if (response.status === 200) {
          if (availableMenus.length === 0 && response.data.menus) {
            setAvailableMenus(response.data.menus);
          }
          setUserPermissions(prev => ({
            ...prev,
            [idusuario]: response.data.allowedMenuIds
          }));
        }
      } catch (error) {
        toast.error("Error al obtener permisos de pantallas");
        console.error(error);
      } finally {
        setLoadingPermisos(false);
      }
    }
  };

  const handlePermissionToggle = async (idusuario, idmenu) => {
    const currentAllowed = userPermissions[idusuario] || [];
    let newAllowed;
    if (currentAllowed.includes(idmenu)) {
      newAllowed = currentAllowed.filter(id => id !== idmenu);
    } else {
      newAllowed = [...currentAllowed, idmenu];
    }

    // Optimistic UI update
    setUserPermissions(prev => ({
      ...prev,
      [idusuario]: newAllowed
    }));

    try {
      const response = await axios.post("/api/private/users/permisos", {
        idusuario,
        menuIds: newAllowed
      });
      if (response.status === 200) {
        toast.success("Accesos a pantallas actualizados");
      }
    } catch (error) {
      toast.error("Error al actualizar accesos");
      console.error(error);
      // Revert optimistic update
      setUserPermissions(prev => ({
        ...prev,
        [idusuario]: currentAllowed
      }));
    }
  };

  const handleDeleteUser = async (idusuario, userNombre) => {
    if (currentUser && currentUser.idusuario === idusuario) {
      toast.error("No puedes eliminar tu propia cuenta.");
      return;
    }

    if (!window.confirm(`¿Estás seguro de que deseas eliminar al usuario "${userNombre}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      const response = await axios.delete(`/api/private/users?id=${idusuario}`);
      if (response.status === 200) {
        toast.success("Usuario eliminado con éxito");
        setLocalUsers((prev) => prev.filter((u) => u.idusuario !== idusuario));
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Error al eliminar usuario");
      console.error(error);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {localUsers.map((user) => (
          <div
            key={user.idusuario}
            className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                {user.nombre} {user.apellidopaterno} {user.apellidomaterno}
              </h2>
              <div className="space-y-1.5 mb-4">
                <p className="text-gray-500 text-sm">
                  <span className="font-semibold text-gray-600">Email:</span> {user.email}
                </p>
                <p className="text-gray-500 text-sm">
                  <span className="font-semibold text-gray-600">Creación:</span>{" "}
                  {new Date(user.creation_date).toLocaleDateString()}
                </p>
                <p className="text-gray-500 text-sm">
                  <span className="font-semibold text-gray-600">Estado:</span>{" "}
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                      user.status === 1
                        ? "bg-green-50 text-green-700 border border-green-150"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {user.status === 1 ? "Activo" : "Inactivo"}
                  </span>
                </p>
              </div>

              {/* Sección de Accesos a Pantallas */}
              <div className="mt-4 mb-5">
                <button
                  type="button"
                  onClick={() => handleToggleExpand(user.idusuario)}
                  className="w-full flex items-center justify-between p-3.5 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wider transition shadow-sm"
                >
                  <span>Pantallas Autorizadas</span>
                  <span className="text-gray-400">
                    {expandedUser === user.idusuario ? "▲ Ocultar" : "▼ Configurar"}
                  </span>
                </button>

                {expandedUser === user.idusuario && (
                  <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-100 shadow-inner space-y-3 transition duration-200">
                    {loadingPermisos && !userPermissions[user.idusuario] ? (
                      <div className="flex justify-center items-center py-4">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500"></div>
                      </div>
                    ) : (
                      <>
                        {availableMenus.length === 0 ? (
                          <p className="text-xs text-gray-400 text-center">No hay pantallas configuradas.</p>
                        ) : (
                          availableMenus.map((m) => {
                            const isChecked = (userPermissions[user.idusuario] || []).includes(m.idmenu);
                            return (
                              <label
                                key={m.idmenu}
                                className="flex items-center gap-3 p-2 hover:bg-white hover:shadow-sm rounded-md cursor-pointer transition border border-transparent hover:border-gray-150"
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => handlePermissionToggle(user.idusuario, m.idmenu)}
                                  className="h-4 w-4 rounded text-red-600 border-gray-300 focus:ring-red-500 cursor-pointer transition"
                                />
                                <div className="text-gray-500">
                                  <ConvertTextToIconComponent nombreIcono={m.icono} className="h-4 w-4" />
                                </div>
                                <span className="text-sm font-semibold text-gray-700 select-none">
                                  {m.nombre}
                                </span>
                              </label>
                            );
                          })
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <button
                type="button"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 border border-gray-200 transition"
              >
                <FcKey className="h-4 w-4" />
                <span>Contraseña</span>
              </button>
              <button
                type="button"
                onClick={() => handleDeleteUser(user.idusuario, `${user.nombre} ${user.apellidopaterno || ""}`.trim())}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-100 border border-red-200 transition"
              >
                <FaTrash className="h-3.5 w-3.5" />
                <span>Eliminar</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ContentUsuariosComponent;
