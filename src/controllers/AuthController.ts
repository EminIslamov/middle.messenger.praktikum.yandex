import { HTTPTransport } from "../api/api.js";
import type { Router } from "../core/router.js";

const authAPI = new HTTPTransport();
const BASE_URL = "https://ya-praktikum.tech/api/v2";

export const AuthController = {
  async login(data: { login: string; password: string }, router: Router) {
    try {
      const response = await authAPI.post(`${BASE_URL}/auth/signin`, {
        headers: { "Content-Type": "application/json" },
        data,
      });

      if (response.status === 200) {
        await this.getUser();
        router.go("/messenger");
      } else {
        throw new Error(`Login failed: ${response.responseText}`);
      }
    } catch (error) {
      console.error("Login error", error);
      throw error;
    }
  },

  async signup(data: Record<string, string>, router: Router) {
    try {
      const response = await authAPI.post(`${BASE_URL}/auth/signup`, {
        headers: { "Content-Type": "application/json" },
        data,
      });

      if (response.status === 200 || response.status === 201) {
        await this.getUser();
        router.go("/messenger");
      } else {
        throw new Error(`Signup failed: ${response.responseText}`);
      }
    } catch (error) {
      console.error("Signup error", error);
      throw error;
    }
  },

  async getUser() {
    try {
      const response = await authAPI.get(`${BASE_URL}/auth/user`);
      if (response.status !== 200) {
        throw new Error("User not authenticated");
      }
      return JSON.parse(response.responseText);
    } catch (e) {
      console.error(e);
      throw new Error("User not authenticated");
    }
  },

  async logout(router: Router) {
    try {
      await authAPI.post(`${BASE_URL}/auth/logout`);
      router.go("/");
    } catch (error) {
      console.error("Logout error", error);
    }
  },

  async updateUser(data: Record<string, string>) {
    try {
      const response = await authAPI.put(
        `${BASE_URL.replace("/auth", "")}/user/profile`,
        {
          headers: { "Content-Type": "application/json" },
          data,
        },
      );

      if (response.status === 200) {
        return JSON.parse(response.responseText);
      } else {
        throw new Error(`Update user failed: ${response.responseText}`);
      }
    } catch (error) {
      console.error("Update user error", error);
      throw error;
    }
  },

  async updateAvatar(avatarFile: File) {
    const formData = new FormData();
    console.log("avatarFile", avatarFile);
    formData.append("avatar", avatarFile);

    try {
      const response = await authAPI.put(`${BASE_URL}/user/profile/avatar`, {
        data: formData,
        isFormData: true,
      });

      if (response.status === 200) {
        return JSON.parse(response.responseText); // <-- вот тут возвращается ответ
      } else {
        throw new Error(`Update avatar failed: ${response.responseText}`);
      }
    } catch (error) {
      console.error("Update avatar error", error);
      throw error;
    }
  },

  async changePassword(data: { oldPassword: string; newPassword: string }) {
    try {
      const response = await authAPI.put(`${BASE_URL}/user/password`, {
        headers: { "Content-Type": "application/json" },
        data,
      });

      if (response.status !== 200) {
        throw new Error(`Change password failed: ${response.responseText}`);
      }
    } catch (error) {
      console.error("Change password error", error);
      throw error;
    }
  },
};
