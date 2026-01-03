import axios ,{ AxiosError,InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";



// Next.js API route'ları aynı domain'de çalıştığı için baseURL boş olmalı
// Eğer farklı bir backend kullanılıyorsa, NEXT_PUBLIC_API_URL tanımlanmalı
const baseURL = process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.trim() !== ""
  ? process.env.NEXT_PUBLIC_API_URL
  : "";

const api = axios.create({
  baseURL: baseURL || undefined, // Boş string ise undefined yap (relative path için)
  withCredentials: true,
  headers:{
    'Content-Type':'application/json'
  }
});
console.log('BaseURL: ',baseURL);

const getAccessToken = (): string | undefined => {
  return Cookies.get('accessToken')
}

const getRefreshToken = (): string | undefined => {
  return Cookies.get('refreshToken')
}

const setAccessToken = (token:string):void=>{
  Cookies.set('accessToken',token,{
    expires:1/96,
    path:'/',
    secure:false,
    sameSite:'lax' as const
  })
};

const clearTokens = ():void => {
  Cookies.remove('accessToken')
  Cookies.remove('refreshToken')
  Cookies.remove('user')
}

let isRefreshing = false;
let failedQueue:Array<{
  resolve:(value?:string) => void
  reject:(reason?:any) => void;
}> = [];

const processQueue = (err: any, token: string | null = null)=> {
  failedQueue.forEach(prom => {
    if (err) {
      prom.reject(err);
    } else {
      prom.resolve(token || undefined)
    }
  });
  failedQueue = [];
}

const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = getRefreshToken()
  
  if (!refreshToken) {
    throw new Error('Refresh token bulunamadı !!')
  }
  
  try {
    const response = await api.post("/api/refresh", { refreshToken });
    
    const { accessToken } = response.data;
    setAccessToken(accessToken);
    return accessToken;

  } catch (err: any) {
    clearTokens()
    throw new Error(`Access token yeniden oluşturulurken bir hata oluştu: ${err.message || err}`);
  } 
}

api.interceptors.request.use(
  (config:InternalAxiosRequestConfig) => {
    const url = config.url || "";
    const isPublicEndpoint =
      url.includes('/api/login') ||
      url.includes('/api/register') ||
      url.includes('/api/check-db') ||
      url.includes('/api/refresh')

    if (!isPublicEndpoint) {
      const token = getAccessToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!error.response) {
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {

      // Public endpoint'ler için refresh token denenmemeli
      const isPublicEndpoint = 
        originalRequest.url?.includes('/api/login') ||
        originalRequest.url?.includes('/api/register') ||
        originalRequest.url?.includes('/api/check-db') ||
        originalRequest.url?.includes('/api/refresh');

      if (isPublicEndpoint) {
        if (originalRequest.url?.includes('/api/refresh')) {
          clearTokens();
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/sign-in';
          }
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();

        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        processQueue(refreshError, null);
        clearTokens();

        if (typeof window !== 'undefined') {
          window.location.href = '/auth/sign-in';
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;


















