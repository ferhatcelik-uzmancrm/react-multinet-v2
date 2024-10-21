import axios, { AxiosError, AxiosResponse } from "axios";
import { ForgotPasswordRequestModel, LoginRequestModel } from "../models/Login";

// const NET_URL = "http://localhost:60871";  //.NET WebAPI LOCAL
// const FASTAPI_URL = "http://127.0.0.1:8000";  //Python FastAPI LOCAL
// const NET_URL = process.env.REACT_APP_NET_URL || "http://193.243.195.51:9090";
// const NET_URL = "https://localhost:44366/api";
const FASTAPI_URL = "https://oto_service-1-q9834787.deta.app";
// const CRM_API_URL = "https://localhost:44366";
const CRM_API_URL = "https://uzmandemo.com:1228/MultinetApi";

const apiService = axios.create({
  timeout: 100000,
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials: true,
});

apiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("Token: ", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const handleApiError = (error: AxiosError): Error => {
  if (error.response) {
    console.error("API Error:", error.response.data);
    return new Error("An error occurred while processing your request.");
  } else if (error.request) {
    console.error("No response received from the server.");
    return new Error("No response received from the server.");
  } else {
    console.error("Request setup error:", error.message);
    return new Error("An error occurred while setting up the request.");
  }
};

export const loginRequest = async (
  url: string,
  loginModel: LoginRequestModel
): Promise<AxiosResponse> => {
  try {
    const response = await apiService.post(`${CRM_API_URL}/${url}`, loginModel);
    console.log("Response: ", response);
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
    const response = await apiService.post(`${CRM_API_URL}/${url}`, reuestModel);
    console.log("Response: ", response);
    return response;
  } catch (error) {
    throw handleApiError(error as AxiosError);
  }
};

export const getData = async (
  url: string,
  params: any
): Promise<AxiosResponse> => {
  try {
    const response = await apiService.post(`${FASTAPI_URL}/${url}`, params);
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
    const response = await apiService.post(`${CRM_API_URL}/${url}`, params);
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
    const response = await apiService.get(`${FASTAPI_URL}/${url}/${userId}`);
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
    console.log("URL: ", `${CRM_API_URL}/${url}/${userId}`);
    const response = await apiService.get(`${CRM_API_URL}/${url}/${userId}`);
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
    const response = await apiService.post(`${CRM_API_URL}/${url}`, data);
    return response;
  } catch (error) {
    throw handleApiError(error as AxiosError);
  }
};

// export const createPost = async (post: any): Promise<AxiosResponse> => {
//   try {
//     const response = await apiService.post("/posts", post);
//     return response;
//   } catch (error) {
//     throw handleApiError(error as AxiosError);
//   }
// };

export default apiService;
