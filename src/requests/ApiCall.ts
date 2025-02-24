import axios, { AxiosError, AxiosResponse } from "axios";
import { ForgotPasswordRequestModel, LoginRequestModel } from "../models/Login";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import TokenService from "../services/TokenService";
import config from "../config/config";

const configInstance = config.getInstance();

const apiUrl = configInstance.getApiUrl();
const headers = configInstance.getHeaders();

interface ApiErrorResponse {
  message?: string;
  code?: string;
  details?: any;
  Success?: boolean;
}

const apiService = axios.create({
  timeout: configInstance.getTimeout(),
  headers: configInstance.getHeaders(),
  withCredentials: true,
});

const logoutAndRedirect = async () => {
  try {
    await apiService.post(`${apiUrl}/api/user/logout`);
    TokenService.removeToken();
    sessionStorage.clear();
    window.location.href = "/auth";
  } catch (error) {
    console.error("Logout error:", error);
    window.location.href = "/auth";
  }
};

apiService.interceptors.request.use(
  (config) => {
    const token = TokenService.getToken();
    
    if (token) {
      if (TokenService.isBlacklisted(token)) {
        // Geçersiz oturum
        window.location.href = "/auth";
        return Promise.reject("Invalid token");
      }
      // Token ekle
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers["X-Request-ID"] = crypto.randomUUID();
    config.headers["X-Request-Time"] = new Date().toISOString();

    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

apiService.interceptors.response.use(
  (response) => {
    delete response.headers["server"];
    delete response.headers["x-powered-by"];
    delete response.headers["x-aspnet-version"];
    delete response.headers["x-aspnetmvc-version"];
    delete response.headers["x-aspnetcore-version"];
    delete response.headers["x-sourcefiles"];
    delete response.headers["x-runtime"];
    delete response.headers["x-version"];
    
    TokenService.extendSession();
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (error.response?.status === 401) {
      try {
        // Access token geçersiz, refresh token ile yenilemeyi dene
        const refreshResponse = await apiService.post(`${apiUrl}/api/user/refresh-token`);
        if (refreshResponse.data.Success) {
          // Yeni token'ı kaydet
          TokenService.setToken(refreshResponse.data.token);
          
          // Başarısız olan isteği yeni token ile tekrarla
          if (originalRequest && originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.token}`;
            return apiService(originalRequest);
          }
        } else {
          await logoutAndRedirect();
        }
      } catch (refreshError) {
        await logoutAndRedirect();
      }
    }

    const errorMessage = (error.response?.data as ApiErrorResponse)?.message || "Bir hata oluştu";
    
    switch (error.response?.status) {
      case 400:
        console.error("Geçersiz istek:", errorMessage);
        break;
      case 403:
        console.error("Yetkisiz erişim:", errorMessage);
        window.location.href = "/error";
        break;
      case 404:
        console.error("Kaynak bulunamadı:", errorMessage);
        break;
      case 500:
        console.error("Sunucu hatası:", errorMessage);
        break;
      default:
        console.error("Beklenmeyen hata:", errorMessage);
    }

    return Promise.reject(error);
  }
);

const handleApiError = (error: AxiosError) => {
  const errorResponse = {
    message: "Bir hata oluştu",
    code: "UNKNOWN_ERROR",
    details: null
  };

  if (error.response) {
    errorResponse.message = (error.response.data as ApiErrorResponse)?.message || error.message;
    errorResponse.code = (error.response.data as ApiErrorResponse)?.code || error.name;
    errorResponse.details = (error.response.data as ApiErrorResponse)?.details || null;
  }

  return errorResponse;
};

export const loginRequest = async (
  loginModel: LoginRequestModel
): Promise<AxiosResponse> => {
  try {
    console.log(apiUrl);
    const response = await apiService.post(`${apiUrl}/api/user/login`, loginModel);
    return response;
  } catch (error) {
    throw handleApiError(error as AxiosError);
  }
};

export const forgotPassword = async (
  url:string,
  reuestModel: ForgotPasswordRequestModel
): Promise<AxiosResponse> => {
  try {
    const response = await apiService.post(`${apiUrl}/${url}`, reuestModel);
    return response;
  } catch (error) {
    throw handleApiError(error as AxiosError);
  }
};

export const getData = async (
  url: string
): Promise<AxiosResponse> => {
  try {
    const response = await apiService.get(`${apiUrl}/${url}`);
    return response;
  } catch (error) {
    throw handleApiError(error as AxiosError);
  }
};

export const getCRMData = async (
  url: string,
  params: any
): Promise<AxiosResponse> => {
  try {
    const response = await apiService.post(`${apiUrl}/${url}`, params);
    return response;
  } catch (error) {
    throw handleApiError(error as AxiosError);
  }
};

export const fetchUserData = async (
  url: string,
  userId: string
): Promise<AxiosResponse> => {
  try {
    const response = await apiService.get(`${apiUrl}/${url}/${userId}`);
    return response;
  } catch (error) {
    throw handleApiError(error as AxiosError);
  }
};

export const fetchCRMUserData = async (
  url: string,
  userId: string
): Promise<AxiosResponse> => {
  try {
    const response = await apiService.get(`${apiUrl}/${url}/${userId}`);
    return response;
  } catch (error) {
    throw handleApiError(error as AxiosError);
  }
};

interface RequestData {
  [key: string]: any;
}

export const sendRequest = async (
  url: string,
  data: RequestData
): Promise<AxiosResponse> => {
  try {
    const response = await apiService.post(`${apiUrl}/${url}`, data);
    return response;
  } catch (error) {
    throw handleApiError(error as AxiosError);
  }
};

export default apiService;
