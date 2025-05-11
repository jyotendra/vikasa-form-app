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

/**
 * Creates a default axios client with the base URL set to the API URL
 * Most of the time you need: defaultAxiosClient
 * and should not need to create a new one
 */
export const getDefaulAxios = (props?: AxiosClient) => {
  const axiosConfig = {
    baseURL: props?.baseURL || import.meta.env.VITE_API_URL,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(props?.headers || {}),
    },
  };

  const useAxios = makeUseAxios({
    axios: axios.create(axiosConfig),
  });

  return useAxios;
};

/**
 * Creates an axios client with the base URL set to the API URL
 * and the Authorization header set to the user access token
 * @param props - AxiosClient
 * @returns
 */
export const getAuthedAxios = (props?: AxiosClient) =>
  getDefaulAxios({
    ...(props || {}),
    headers: {
      ...props?.headers,
      Authorization: `Bearer ${getUserAccessToken()}`,
    },
  });

export const defaultAxiosClient = getDefaulAxios();
export const authedAxiosClient = getAuthedAxios();
