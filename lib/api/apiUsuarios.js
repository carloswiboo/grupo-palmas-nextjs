import axios from "axios";
import toast from "react-hot-toast";

export const getUsersPrivateApi = async () => {
  let url = "/api/private/users";

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

export const deleteUserPrivateApi = async (idusuario) => {
  let url = `/api/private/users?id=${idusuario}`;

  try {
    const response = await axios.delete(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      return response;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};
