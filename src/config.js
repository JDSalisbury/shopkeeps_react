export const API_ENV_URL = {
  DEV: "http://127.0.0.1:8000",
  PROD: "https://shopkeeps-fastapi.onrender.com",
};

export const PLAYER_VIEW = process.env.REACT_APP_PLAYER_VIEW === "true";
export const API_BASE_URL = API_ENV_URL[process.env.REACT_APP_ENV || "DEV"];
