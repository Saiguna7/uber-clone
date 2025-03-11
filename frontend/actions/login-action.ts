"use server";

import axios from "axios";

export async function Loginaction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  console.log("Server-side log:", { email, password });

  if (!email || !password) {
    return { success: false, message: "All fields are required" };
  }

  try {
    const response = await axios.post(import.meta.env.VITE_BASE_URL + "/users/login", { email, password });
    // Adjust status check based on your API (200 is typical for login success, not 201)
    if (response.status === 200) {
      const data=response.data
      return { success: true, message: "User logged in successfully",data:data,token:data.token};
    } else {
      return { success: false, message: "Login failed" };
    }
  } catch (error) {
    // Handle specific error cases if possible
    if (axios.isAxiosError(error) && error.response) {
      return { success: false, message: error.response.data.message || "Invalid credentials" };
    }
    return { success: false, message: "An error occurred during login" };
  }
}