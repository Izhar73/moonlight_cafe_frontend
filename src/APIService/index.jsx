import axios from "axios";

const path = "http://localhost:9600";

const headers = {
    headers: {
        "content-type": "application/json"
    }
}

export const postMethod = async (url, data) => {
  const response = await fetch(`http://localhost:9600/${url}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await response.json();
};
export const putMethod = async (endPoint, data) => {
    try {
        const res = await axios.put(`${path}/${endPoint}`, data, headers);
        return res.data;
    } catch (err) {
        return err.response?.data || { error: "An error occurred" };
    }
}

export const getMethod = async (url) => {
  const response = await fetch(`http://localhost:9600/${url}`);
  return await response.json();
};

export const deleteMethod = async (endPoint) => {
    try {
        const res = await axios.delete(`${path}/${endPoint}`);
        return res.data;
    } catch (err) {
        return err.response?.data || { error: "An error occurred" };
    }
};
