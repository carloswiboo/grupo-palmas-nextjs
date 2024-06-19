import axios from "axios";
import { toast } from "react-toastify";

export const getColoresPrivateApi = async () => {
  let url = "/api/private/colores";

  try {
    const response = await axios.get(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "*",
      },
    });

    if (response.status === 200) {
      return response;
    }
  } catch (error) {
    toast.error(error.response.data.error);
    console.error(error);
    return error;
  }
};

export const postCreateColoresPrivateApi = async (values) => {
  let url = "/api/private/colores";

  try {
    const response = await axios.post(url, values, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "*",
      },
    });

    if (response.status === 200) {
      return response;
    }
  } catch (error) {
    toast.error(error.response.data.error);
    console.error(error);
    return error;
  }
};

export const patchColoresPrivateApi = async (values) => {
  let url = "/api/private/colores/";

  try {
    const response = await axios.patch(url, values, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "*",
      },
    });

    if (response.status === 200) {
      return response;
    }
  } catch (error) {
    toast.error(error.response.data.error);
    console.error(error);
    return error;
  }
};

export const deleteColoresPrivateApi = async (values) => {
  let url = "/api/private/colores/";

  try {
    const response = await axios.delete(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "*",
      },
      params: { id: values },
    });

    if (response.status === 200) {
      return response;
    }
  } catch (error) {
    toast.error(error.response.data.error);
    console.error(error);
    return error;
  }
};
