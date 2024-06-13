import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { deleteCookie } from 'cookies-next';

export interface ApiResponse<T> {
  data: T;
  status: number;
}

export class ApiError extends Error {
  response: AxiosResponse;

  constructor(response: AxiosResponse) {
    super(`API error ${response.status}`);
    this.response = response;
  }
}

export const createAxiosInstance = (
  config?: AxiosRequestConfig
): AxiosInstance => {
  const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    ...config,
  });

  // axiosInstance.interceptors.response.use(
  //   (response) => response,
  //   (error) => {
  //     if (error.response) {
  //       throw new ApiError(error.response);
  //     }
  //     throw error;
  //   }
  // );

  axiosInstance.interceptors.request.use(
    (config: any) => {
      return config;
    },
    (error: any) => {
      return Promise.reject(error);
    }
  );
  axiosInstance.interceptors.response.use(
    function (response: any) {
      return response;
    },
    function (error: any) {
      console.log(error)
      if (error.response) {
        if (error.response.status == 401) {
          deleteCookie("token");
          // router.push("/login");
        }
        throw new ApiError(error.response);
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export const axiosInstance = createAxiosInstance();