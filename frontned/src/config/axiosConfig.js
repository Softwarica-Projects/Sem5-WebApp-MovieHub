import axios from 'axios';
import { handleError } from '../utils/toastUtils';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); 
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 403) {
            const role = localStorage.getItem('role');
            const path = window.location.pathname;
            localStorage.clear();
            if (
                path === '/admin/login' ||
                path === '/login' ||
                path === '/'
            ) {
            } else {
                handleError(error, 'Session Expired, Please login to continue');
                if (role === 'admin') {
                    window.location.href = '/admin/login';
                } else {
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;