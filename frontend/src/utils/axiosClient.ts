import axios, { CreateAxiosDefaults } from "axios";
import { makeUseAxios } from "axios-hooks";
import { getUserAccessToken } from "./auth";
import { AppEnv } from "../helpers/env";

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
    baseURL: props?.baseURL || AppEnv.VITE_API_URL,
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
export const getAuthedAxios = (props?: AxiosClient) => {
  const axiosConfig = {
    baseURL: props?.baseURL || AppEnv.VITE_API_URL,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(props?.headers || {}),
    },
  };

  const axiosInstance = axios.create(axiosConfig);
  axiosInstance.interceptors.request.use(
    (config) => {
      const accessToken = getUserAccessToken(); // its important to get the access token via interceptor
      // because otherwise, if called directly in top-level code,
      // it will not have the latest access token if it was refreshed
      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      } else {
        throw new Error(
          "No access token found for requests for authenticated routes"
        );
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const useAxios = makeUseAxios({
    axios: axiosInstance,
  });

  return useAxios;
};

export const useDefaultAxiosClient = getDefaulAxios();
export const useAuthedAxiosClient = getAuthedAxios();
