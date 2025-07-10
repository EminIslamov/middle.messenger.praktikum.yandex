import { HTTPTransport } from "../api/api";

const chatAPI = new HTTPTransport();
const BASE_URL = "https://ya-praktikum.tech/api/v2/chats";

export const ChatController = {
  async getChats() {
    try {
      const response = await chatAPI.get(BASE_URL);
      if (response.status === 200) {
        return JSON.parse(response.responseText);
      } else {
        throw new Error(`Get chats failed: ${response.responseText}`);
      }
    } catch (error) {
      console.error("Get chats error", error);
      throw error;
    }
  },

  async createChat(title: string) {
    try {
      const response = await chatAPI.post(BASE_URL, {
        headers: { "Content-Type": "application/json" },
        data: { title },
      });

      if (response.status === 200) {
        return JSON.parse(response.responseText);
      } else {
        throw new Error(`Create chat failed: ${response.responseText}`);
      }
    } catch (error) {
      console.error("Create chat error", error);
      throw error;
    }
  },

  async deleteChat(chatId: number) {
    try {
      const response = await chatAPI.delete(BASE_URL, {
        headers: { "Content-Type": "application/json" },
        data: { chatId },
      });

      if (response.status !== 200) {
        throw new Error(`Delete chat failed: ${response.responseText}`);
      }
    } catch (error) {
      console.error("Delete chat error", error);
      throw error;
    }
  },

  async addUsersToChat(chatId: number, users: number[]) {
    try {
      const response = await chatAPI.put(`${BASE_URL}/users`, {
        headers: { "Content-Type": "application/json" },
        data: { users, chatId },
      });

      if (response.status !== 200) {
        throw new Error(`Add users to chat failed: ${response.responseText}`);
      }
    } catch (error) {
      console.error("Add users to chat error", error);
      throw error;
    }
  },

  async deleteUsersFromChat(chatId: number, users: number[]) {
    try {
      const response = await chatAPI.delete(`${BASE_URL}/users`, {
        headers: { "Content-Type": "application/json" },
        data: { users, chatId },
      });

      if (response.status !== 200) {
        throw new Error(`Delete users from chat failed: ${response.responseText}`);
      }
    } catch (error) {
      console.error("Delete users from chat error", error);
      throw error;
    }
  },

  async getChatUsers(chatId: number) {
    try {
      const response = await chatAPI.get(`${BASE_URL}/${chatId}/users`);
      if (response.status === 200) {
        return JSON.parse(response.responseText);
      } else {
        throw new Error(`Get chat users failed: ${response.responseText}`);
      }
    } catch (error) {
      console.error("Get chat users error", error);
      throw error;
    }
  },

  async getChatToken(chatId: number) {
    try {
      const response = await chatAPI.post(`${BASE_URL}/token/${chatId}`);
      if (response.status === 200) {
        return JSON.parse(response.responseText);
      } else {
        throw new Error(`Get chat token failed: ${response.responseText}`);
      }
    } catch (error) {
      console.error("Get chat token error", error);
      throw error;
    }
  },

  async getUnreadCount(chatId: number) {
    try {
      const response = await chatAPI.get(`${BASE_URL}/new/${chatId}`);
      if (response.status === 200) {
        return JSON.parse(response.responseText);
      } else {
        throw new Error(`Get unread count failed: ${response.responseText}`);
      }
    } catch (error) {
      console.error("Get unread count error", error);
      throw error;
    }
  },

  async uploadChatAvatar(chatId: number, avatarFile: File) {
    const formData = new FormData();
    formData.append("avatar", avatarFile);
    formData.append("chatId", chatId.toString());

    try {
      const response = await chatAPI.put(`${BASE_URL}/avatar`, {
        data: formData,
        isFormData: true,
      });

      if (response.status === 200) {
        return JSON.parse(response.responseText);
      } else {
        throw new Error(`Upload chat avatar failed: ${response.responseText}`);
      }
    } catch (error) {
      console.error("Upload chat avatar error", error);
      throw error;
    }
  },
};
