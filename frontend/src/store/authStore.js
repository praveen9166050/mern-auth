import { create } from "zustand";
import axios from "axios";

axios.defaults.withCredentials = true;

const API_URL = `${import.meta.env.VITE_API_URL}/api/auth`;
console.log(API_URL);
export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  message: null,
  isCheckingAuth: true,
  signup: async (email, password, name) => {
    try {
      set({isLoading: true, error: null});
      const response = await axios.post(`${API_URL}/signup`, {email, password, name});
      set({user: response.data.user, isAuthenticated: true, isLoading: false});
    } catch (error) {
      set({error: error.response.data.message || "Error signing up", isLoading: false});
      throw error;
    }
  },
  verifyEmail: async (code) => {
    try {
      set({isLoading: true, error: null});
      const response = await axios.post(`${API_URL}/verify-email`, {code});
      set({user: response.data.user, isAuthenticated: true, isLoading: false});
      return response.data;
    } catch (error) {
      set({error: error.response.data.message || "Error verifying email", isLoading: false});
      throw error;
    }
  },
  login: async (email, password) => {
    try {
      set({isLoading: true, error: null});
      const response = await axios.post(`${API_URL}/login`, {email, password});
      set({user: response.data.user, isAuthenticated: true, isLoading: false});
    } catch (error) {
      set({error: error.response.data.message || "Error logging in", isLoading: false});
      throw error;
    }
  },
  logout: async () => {
    try {
      set({isLoading: true, error: null});
      const response = await axios.post(`${API_URL}/logout`);
      set({user: null, isAuthenticated: false, isLoading: false});
    } catch (error) {
      set({error: error.response.data.message || "Error logging out", isLoading: false});
      throw error;
    }
  },
  checkAuth: async () => {
    try {
      set({isCheckingAuth: true, error: null});
      const response = await axios.get(`${API_URL}/check-auth`);
      set({user: response.data.user, isAuthenticated: true, isCheckingAuth: false});
    } catch (error) {
      set({isCheckingAuth: false, isAuthenticated: false});
    }
  },
  forgotPassword: async (email) => {
    try {
      set({isLoading: true, error: null, message: null});
      const response = await axios.post(`${API_URL}/forgot-password`, {email});
      set({message: response.data.message, isLoading: false});
    } catch (error) {
      set({error: error.response.data.message || "Error sending reset password mail", isLoading: false});
      throw error;
    }
  },
  resetPassword: async (token, password) => {
    try {
      set({isLoading: true, error: null, message: null});
      const response = await axios.post(`${API_URL}/reset-password/${token}`, {password});
      set({message: response.data.message, isLoading: false});
    } catch (error) {
      set({error: error.response.data.message || "Error restting the password", isLoading: false});
      throw error;
    }
  }
}));