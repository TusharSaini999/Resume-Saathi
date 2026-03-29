import API from "./api";

class AuthService extends API {
  async login(credentials) {
    try {
      const response = await this.api.post("/users/login", credentials);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
  async signup(userData) {
    try {
      const response = await this.api.post("/users/register", userData);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
  async resendVerificationEmail(userId) {
    try {
      const response = await this.api.post("/users/resend-verification-email", {
        userId,
      });
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
  async verifyEmail(token) {
    try {
      const response = await this.api.get(`/users/verify-email?token=${token}`);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
  async forgotPassword(email) {
    try {
      const response = await this.api.post("/users/forgot-password", { email });
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
  async resetPassword(token, newPassword) {
    try {
      const response = await this.api.post("/users/reset-password", {
        token,
        newPassword,
      });
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await this.api.post("/users/change-password", {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
  async getSessions() {
    try {
      const response = await this.api.get("/users/sessions");
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
  async logout() {
    try {
      const response = await this.api.post("/users/logout");
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
  async logoutAll() {
    try {
      const response = await this.api.delete("/users/logout-all");
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
  async killSession(sessionId) {
    try {
      const response = await this.api.delete(`/users/sessions/${sessionId}`);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
  async getProfile() {
    try {
      const response = await this.api.get("/users/me");
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
  async loginWithGoogle() {
    try {
      // Redirect to Google OAuth endpoint
      const apiBaseUrl = this.api.defaults.baseURL || window.location.origin;
      window.location.href = `${apiBaseUrl}/auth/google`;
    } catch (error) {
      return error.response?.data || { success: false, message: "Failed to initiate Google login" };
    }
  }
  async loginWithLinkedin() {
    try {
      // Redirect to LinkedIn OAuth endpoint
      const apiBaseUrl = this.api.defaults.baseURL || window.location.origin;
      window.location.href = `${apiBaseUrl}/auth/linkedin`;
    } catch (error) {
      return error.response?.data || { success: false, message: "Failed to initiate LinkedIn login" };
    }
  }
}

export default new AuthService();
