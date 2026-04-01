import axios from "axios";
import { SERVER_URL } from "../constants/envConfig";

const PUBLIC_IP_ENDPOINTS = [
  "https://api64.ipify.org?format=json",
  "https://api.ipify.org?format=json",
];

let cachedPublicIp = null;
let pendingPublicIpPromise = null;

const getClientPublicIp = async () => {
  if (cachedPublicIp) {
    return cachedPublicIp;
  }

  if (pendingPublicIpPromise) {
    return pendingPublicIpPromise;
  }

  pendingPublicIpPromise = (async () => {
    for (const endpoint of PUBLIC_IP_ENDPOINTS) {
      try {
        const response = await fetch(endpoint, { cache: "no-store" });
        if (!response.ok) {
          continue;
        }

        const data = await response.json();
        const ip = data?.ip?.trim();
        if (ip) {
          cachedPublicIp = ip;
          return ip;
        }
      } catch {
        // Ignore endpoint failures and try the next one.
      }
    }

    return null;
  })();

  const result = await pendingPublicIpPromise;
  pendingPublicIpPromise = null;
  return result;
};

class API {
  constructor() {
    this.api = axios.create({
      baseURL: SERVER_URL,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.api.interceptors.request.use(async (config) => {
      const publicIp = await getClientPublicIp();

      if (publicIp) {
        config.headers = {
          ...(config.headers || {}),
          "X-Client-Public-IP": publicIp,
        };
      }

      return config;
    });
  }
}

export default API;
