import axios from "axios";
import { toast } from "react-toastify";

export const getMenuYfunciones = async () => {
  let url = "/api/private/menuyfunciones";
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
