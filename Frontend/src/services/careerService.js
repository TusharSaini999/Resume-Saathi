import API from "./api";

class CareerService extends API {
  async getCompanies() {
    try {
      const response = await this.api.get("/careers/companies");
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: "Failed to fetch companies" };
    }
  }

  async getHealth() {
    try {
      const response = await this.api.get("/careers/health");
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: "Failed to get portal health" };
    }
  }

  async purgeCache() {
    try {
      const response = await this.api.post("/careers/clear-cache");
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: "Failed to purge cache" };
    }
  }

  async verifyJobOnline(payload = {}) {
    try {
      const response = await this.api.post("/careers/verify-online", payload);
      return response.data;
    } catch (error) {
      try {
        const getRes = await this.api.get("/careers/verify-online", {
          params: { url: payload.url || payload.job?.applyUrl },
        });
        return getRes.data;
      } catch {
        return error.response?.data || { success: false, message: "Failed to verify online status" };
      }
    }
  }

  async getCompanyProfile(slug) {
    try {
      const response = await this.api.get(`/careers/companies/${slug}`);
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: "Failed to get company profile" };
    }
  }

  async scanCompanyPortal(params = {}) {
    try {
      const response = await this.api.post("/careers/scan-portal", params);
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: "Failed to scan official career portal" };
    }
  }

  async getCareerJobs(params = {}) {
    try {
      const response = await this.api.get("/careers/jobs", { params });
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: "Failed to fetch career jobs" };
    }
  }

  async trackJob(jobData) {
    try {
      const response = await this.api.post("/careers/track", jobData);
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: "Failed to track job" };
    }
  }

  async getTrackedJobs() {
    try {
      const response = await this.api.get("/careers/tracked");
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: "Failed to fetch tracked jobs" };
    }
  }

  async updateTrackedStatus(id, data) {
    try {
      const response = await this.api.patch(`/careers/tracked/${id}`, data);
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: "Failed to update tracked status" };
    }
  }

  async deleteTrackedJob(id) {
    try {
      const response = await this.api.delete(`/careers/tracked/${id}`);
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: "Failed to delete tracked job" };
    }
  }

  async postJobProfile(jobData) {
    try {
      const response = await this.api.post("/careers/post-job", jobData);
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: "Failed to post job profile" };
    }
  }

  async getFullJobDescription(payload = {}) {
    try {
      const response = await this.api.post("/careers/jobs/full-description", payload);
      return response.data;
    } catch (error) {
      try {
        const getRes = await this.api.get("/careers/jobs/full-description", { params: payload });
        return getRes.data;
      } catch {
        return (
          error.response?.data || {
            success: false,
            message: "Failed to retrieve full job description",
          }
        );
      }
    }
  }
}

export default new CareerService();
