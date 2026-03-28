import API from "./api";

class chatService extends API {
  async sendMessage(query, chatId) {
    try {
      const payload = chatId ? { query, chatId } : { query };

      const response = await this.api.post("/chating/chat/", payload);

      return response.data;
    } catch (error) {
      return error.response?.data || { message: "Something went wrong" };
    }
  }

  async getChat(id) {
    try {
      const response = await this.api.get(`/chating/chat/history/${id}`);
      return response.data;
    } catch (error) {
      return error.response?.data || { message: "Something went wrong" };
    }
  }

  async getChatList() {
    try {
      const response = await this.api.get("/chating/chat/history");
      return response.data;
    } catch (error) {
      return error.response?.data || { message: "Something went wrong" };
    }
  }

  async deleteChat(id) {
    try {
      const response = await this.api.delete(`/chating/chat/history/${id}`);
      return response.data;
    } catch (error) {
      return error.response?.data || { message: "Something went wrong" };
    }
  }
}

export default new chatService();