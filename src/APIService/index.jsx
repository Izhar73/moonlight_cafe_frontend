import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const headers = {
  headers: {
    "content-type": "application/json",
  },
};

// POST
export const postMethod = async (url, data) => {
  const response = await fetch(`${BASE_URL}/${url}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return await response.json();
};

// PUT
export const putMethod = async (endPoint, data) => {
  try {
    const res = await axios.put(`${BASE_URL}/${endPoint}`, data, headers);
    return res.data;
  } catch (err) {
    return err.response?.data || { error: "An error occurred" };
  }
};

// GET
export const getMethod = async (url) => {
  const response = await fetch(`${BASE_URL}/${url}`);
  return await response.json();
};

// DELETE
export const deleteMethod = async (endPoint) => {
  try {
    const res = await axios.delete(`${BASE_URL}/${endPoint}`);
    return res.data;
  } catch (err) {
    return err.response?.data || { error: "An error occurred" };
  }
};
