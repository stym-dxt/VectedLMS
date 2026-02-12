import { create } from "zustand";
import api from "@/lib/api";

interface User {
  id: number;
  email: string;
  full_name: string | null;
  role: string;
  is_active: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithPhone: (idToken: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    full_name?: string,
    phone?: string,
  ) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),
  isLoading: false,

  login: async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password });
    const { access_token } = response.data;
    localStorage.setItem("token", access_token);
    set({ token: access_token, isAuthenticated: true });
    await useAuthStore.getState().fetchUser();
  },

  loginWithPhone: async (idToken: string) => {
    const response = await api.post("/auth/verify-phone", { id_token: idToken });
    const { access_token } = response.data;
    localStorage.setItem("token", access_token);
    set({ token: access_token, isAuthenticated: true });
    await useAuthStore.getState().fetchUser();
  },

  register: async (email: string, password: string, full_name?: string, phone?: string) => {
    const payload: { email: string; password: string; full_name?: string; phone?: string } = {
      email,
      password,
    };
    if (full_name && full_name.trim()) payload.full_name = full_name.trim();
    if (phone && phone.trim()) payload.phone = phone.trim().replace(/\s/g, "");
    await api.post("/auth/register", payload);
    await useAuthStore.getState().login(email, password);
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null, isAuthenticated: false });
  },

  fetchUser: async () => {
    try {
      const response = await api.get("/auth/me");
      set({ user: response.data });
    } catch (error) {
      useAuthStore.getState().logout();
    }
  },

  initialize: async () => {
    const token = localStorage.getItem("token");
    if (token) {
      set({ isLoading: true, token, isAuthenticated: true });
      try {
        await useAuthStore.getState().fetchUser();
      } catch (error) {
        // Token invalid, already handled in fetchUser
      } finally {
        set({ isLoading: false });
      }
    }
  },
}));
