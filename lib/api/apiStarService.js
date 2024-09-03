import axios from "axios";
import { toast } from "react-toastify";

export const getModelosPrivateApi = async () => {
  let url = "/api/private/modelos";

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

export const postStarServicePrivateApi = async (values) => {
  let url = "/api/private/starservice";

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

export const patchModelosPrivateApi = async (values) => {
  let url = "/api/private/modelos/";

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

export const deleteStarServicePrivateApi = async (values) => {
  let url = "/api/private/starservice/";

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
