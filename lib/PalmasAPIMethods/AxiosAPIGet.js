import axios from "axios";
import toast from "react-hot-toast";

export const AxiosAPIGet = async (url = "", params = {}) => {
  try {
    const response = await axios.get(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-AllowHeaders": "*",
      },
      params: params,
    });

    if (response.status === 200) {
      console.log(response.data);
      return response;
    }
  } catch (error) {
    toast.error("Error al obtener los datos. " + error.message);
    console.error("Error fetching data:", error);
    // Puedes lanzar el error nuevamente o manejarlo de otra manera
    return error;
  }
};
