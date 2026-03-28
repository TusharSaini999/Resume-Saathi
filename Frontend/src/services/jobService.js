import API from "./api";

class JobService extends API {
    async checkJobDec(payload) {
        try {
            const response = await this.api.post("/jobs/check", payload);
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    }
    async getJobDec(){
        try {
            const response = await this.api.post("/jobs/get");
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    }
    async searchJobs(query) {
        try {
            const response = await this.api.get("/jobs/search", {
                params: { query }
            });
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    }
}

export default new JobService();