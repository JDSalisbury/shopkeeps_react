export const API_ENV_URL = {
  DEV: "http://127.0.0.1:8000",
  PROD: "https://shopkeeps-fastapi.onrender.com",
};

// Dynamically select the API URL based on the environment
export const API_BASE_URL = API_ENV_URL[process.env.REACT_APP_ENV || "DEV"];
