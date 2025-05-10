import axios, { CreateAxiosDefaults } from "axios";
import { makeUseAxios } from "axios-hooks";
import { getUserAccessToken } from "./auth";

interface AxiosClient {
  baseURL?: string;
  axios?: CreateAxiosDefaults;
  headers?: {
    [key: string]: string;
  };
}

const getDefaultUseAxios = (props: AxiosClient) => {
  const axiosConfig = {
    baseURL: props.baseURL || import.meta.env.VITE_API_URL,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(props.headers || {}),
    },
  };

  const useAxios = makeUseAxios({
    axios: axios.create(axiosConfig),
  });

  return useAxios;
};

export const authedUseAxios = getDefaultUseAxios({
  headers: {
    Authorization: `Bearer ${getUserAccessToken()}`,
  },
});
