import axios from "axios";
import { SERVER_URL } from "../constants/envConfig";

class API {
  constructor() {
    this.api = axios.create({
      baseURL:SERVER_URL,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

export default API;
