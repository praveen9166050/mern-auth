import { create } from "zustand";
import axios from "axios";

axios.defaults.withCredentials = true;

const API_URL = "http://localhost:5000/api/auth";
export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
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
  }
}));