// src/services/axiosInstance.tsx
import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { auth } from './firebase';
 // Assuming you initialize Firebase Auth here

const axiosInstance = axios.create({
  baseURL: import.meta.env.DEV ? 'http://localhost:3000' : import.meta.env.VITE_BASE_URL,
  // Remove the fallback to localhost as it can cause issues in production
});

// Request interceptor to automatically add the Authorization header
axiosInstance.interceptors.request.use(
  async (request: AxiosRequestConfig|any) => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const idToken = await currentUser.getIdToken();
        if (idToken) {
        request.headers['Authorization'] = `Bearer ${idToken}`}
      }
    } catch (error) {
      console.error('Error getting ID token:', error);
      // Optionally handle the error, e.g., redirect to login
    }
    return request;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (for potential logging - adjust as needed)
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Optional: Log the response status
    // console.log('Response Status:', response.status);
    return response; // Return the response to the calling component
  },
  (error) => {
    // Handle errors here (e.g., logging, custom error messages)
    console.error('Response Error:', error);
    return Promise.reject(error);
  }
);


export default axiosInstance;