import axios from "axios";
import { API_BASE_URL } from "../config";

const adminAxios = axios.create({
  headers: { "x-api-key": process.env.REACT_APP_ADMIN_API_KEY },
});

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
    const response = await adminAxios.post(
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
    await adminAxios.post(`${API_BASE_URL}/generate_inventory/${id}`);
    const response = await axios.get(`${API_BASE_URL}/shopkeep/${id}`); // Fetch updated inventory
    return { data: response.data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
};

export const fetchAllShopkeeps = async (revealedOnly = false) => {
  try {
    const url = revealedOnly
      ? `${API_BASE_URL}/shopkeeps?revealed_only=true`
      : `${API_BASE_URL}/shopkeeps`;
    const response = await axios.get(url);
    return { data: response.data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
};

export const revealShopkeep = async (id) => {
  try {
    const response = await adminAxios.patch(`${API_BASE_URL}/shopkeep/${id}/reveal`);
    return { data: response.data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
};

export const updateShopkeep = async (id, updates) => {
  try {
    const response = await adminAxios.patch(`${API_BASE_URL}/shopkeep/${id}`, updates);
    return { data: response.data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
};

export const addItem = async (shopkeepId, item) => {
  try {
    const response = await adminAxios.post(`${API_BASE_URL}/shopkeep/${shopkeepId}/item`, item);
    return { data: response.data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
};

export const updateItem = async (itemId, updates) => {
  try {
    const response = await adminAxios.patch(`${API_BASE_URL}/item/${itemId}`, updates);
    return { data: response.data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
};

export const deleteItem = async (itemId) => {
  try {
    await adminAxios.delete(`${API_BASE_URL}/item/${itemId}`);
    return { error: null };
  } catch (err) {
    return { error: err.message };
  }
};

export const deleteShopkeep = async (id) => {
  try {
    await adminAxios.delete(`${API_BASE_URL}/shopkeep/${id}`);
    return { error: null };
  } catch (err) {
    return { error: err.message };
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
    const response = await adminAxios.post(
      `${API_BASE_URL}/generate_shopkeep?location=${location}`
    );
    console.log("Shopkeep created:", response.data);
    return { data: response.data.shopkeep, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
};
