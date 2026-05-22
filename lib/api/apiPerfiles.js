import axios from "axios";
import { toast } from "react-toastify";

export const getPerfiles = async () => {
  let url = "/api/private/perfiles";
  try {
    const response = await axios.get(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });
    if (response.status === 200) {
      return response;
    }
  } catch (error) {
    toast.error(error.response?.data?.error || "Error al cargar perfiles");
    console.error(error);
    return error;
  }
};

export const createPerfil = async (nombre) => {
  let url = "/api/private/perfiles";
  try {
    const response = await axios.post(url, { nombre }, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });
    if (response.status === 200) {
      return response;
    }
  } catch (error) {
    toast.error(error.response?.data?.error || "Error al crear perfil");
    console.error(error);
    return error;
  }
};

export const getPerfilPermisos = async (idperfil) => {
  let url = `/api/private/perfiles/permisos?idperfil=${idperfil}`;
  try {
    const response = await axios.get(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });
    if (response.status === 200) {
      return response;
    }
  } catch (error) {
    toast.error(error.response?.data?.error || "Error al obtener permisos");
    console.error(error);
    return error;
  }
};

export const savePerfilPermisos = async (idperfil, menuIds) => {
  let url = "/api/private/perfiles/permisos";
  try {
    const response = await axios.post(url, { idperfil, menuIds }, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });
    if (response.status === 200) {
      return response;
    }
  } catch (error) {
    toast.error(error.response?.data?.error || "Error al guardar permisos");
    console.error(error);
    return error;
  }
};
