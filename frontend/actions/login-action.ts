"use server";

export async function Loginaction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const firstname = formData.get("firstname") as string;
  const lastname = formData.get("lastname") as string;
  console.log("Server-side log:", { email, password, firstname, lastname });
  // Simulate a server response (e.g., login logic)
  return { success: true, message: "Login processed on server" };
}