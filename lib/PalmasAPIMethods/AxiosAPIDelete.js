import toast from "react-hot-toast";
import axios from "axios";

export const AxiosAPIDelete = async (url = "", params = {}, values = {}) => {
  try {
    const response = await axios.delete(url, values, {
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
    debugger;
    toast.error("" + error.response.data.message);
    console.error("Error fetching data:", error);
    // Puedes lanzar el error nuevamente o manejarlo de otra manera
    return error;
  }
};
