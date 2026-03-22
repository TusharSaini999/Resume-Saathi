import API from "./api";

class ResumeService extends API {
  async uploadResume(file) {
    try {
      const formData = new FormData();
      formData.append("resume", file);
      
      // Override Content-Type to allow browser to set multipart/form-data with boundary
      const response = await this.api.post("/resumes/upload", formData, {
        headers: {
          "Content-Type": undefined,
        },
      });
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
}

export default new ResumeService();
