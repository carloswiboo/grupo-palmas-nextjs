import axios from "axios";
import toast from "react-hot-toast";

export const AxiosAPIPostFormData = async (url = "", params = {}, values) => {
  try {
    const response = await axios.post(url, values, {
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        "Access-Control-Allow-Origin": "*",
        maxBodyLength: Infinity,
      },
    });

    if (response.status === 200) {
      console.log(response.data);
      return response;
    }
  } catch (error) {
    toast.error("Error al hacer post a los datos. " + error.message);
    console.error("Error fetching data:", error);
    // Puedes lanzar el error nuevamente o manejarlo de otra manera
    return error;
  }
};
