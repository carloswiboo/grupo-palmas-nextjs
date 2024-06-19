import axios from "axios";
import { toast } from "react-toastify";

export const getBannersPrivateApi = async () => {
  let url = "/api/private/banners";

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

export const postCreateBannersPrivateApi = async (values) => {
  let url = "/api/private/promociones";

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

export const patchCreateBannersPrivateApi = async (values) => {
  let url = "/api/private/promociones/";

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

export const deleteBannersPrivateApi = async (values) => {
  let url = "/api/private/promociones/";

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
