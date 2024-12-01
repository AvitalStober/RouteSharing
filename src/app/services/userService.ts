import axios from "axios";
import User from "../types/users";

const url = "http://localhost:3000";
// https://route-sharing.vercel.app
// http://localhost:3000
export const addUser = async (newUser: User) => {
  try {
    const response = await axios.post(`${url}/api/users`, newUser);
    return response.data;
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${url}/api/users`);
    return response.data;
  } catch (error) {
    console.error("Error get users:", error);
    throw error;
  }
};
