import axios from "axios";
import { API_BASE_URL } from "../config";

export const fetchPlayerview = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/playerview/`);
    return { data: response.data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
};

export const setPlayerview = async (id) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/set_playerview?shopkeep_id=${id}`
    );

    return { data: response.data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
};

export const fetchShopkeepById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/shopkeep/${id}`);
    return { data: response.data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
};

export const generateInventory = async (id) => {
  try {
    await axios.post(`${API_BASE_URL}/generate_inventory/${id}`);
    const response = await axios.get(`${API_BASE_URL}/shopkeep/${id}`); // Fetch updated inventory
    return { data: response.data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
};

export const fetchAllShopkeeps = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/shopkeeps`);
    return { data: response.data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
};

export const addShopkeep = async (setLocation) => {
  let location = "";

  if (setLocation === null) {
    location = prompt("Enter the location for the new shopkeep:");
    if (!location) {
      return { data: null, error: "User cancelled input" };
    }
  } else {
    location = setLocation;
  }

  try {
    console.log("Creating new shopkeep at location:", location);
    const response = await axios.post(
      `${API_BASE_URL}/generate_shopkeep?location=${location}`
    );
    console.log("Shopkeep created:", response.data);
    return { data: response.data.shopkeep, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
};
