import axios,{ AxiosError } from "axios";
interface ServerUserResponse {
  message: string;
  token: string;
}

interface User {
  token: string;
  email: string;
  fullname: {
    firstname: string;
    lastname: string;
  };
}

interface SignupResponse {
  success: boolean;
  message: string;
  data?: User;
  token?: string;
}
export const Signupaction = async (formData: FormData):Promise<SignupResponse> => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;  
  const firstname = formData.get("firstname") as string;
  const lastname = formData.get("lastname") as string;
  
  // Client-side validation
  if (!email || !password || !firstname) {
    return { success: false, message: "All fields are required" };
  }
  
  if (password.length < 6) {
    return { success: false, message: "Password must be at least 6 characters long" };
  }
  
  if (firstname.length < 3) {
    return { success: false, message: "First name must be at least 3 characters long" };
  }
  
  try {
    const response = await axios.post<ServerUserResponse>(
      import.meta.env.VITE_BASE_URL + "/users/register", 
      { 
        email, 
        password, 
        fullname: { firstname, lastname } 
      }
    );
    console.log("Full server response:", response.data);
    if (response.status === 201) {
      const user: User = {
        email,
        fullname: {
          firstname,
          lastname,
        },
        token: response.data.token,
      };
      console.log("User registered successfully:", user);
      return {
        success: true,
        message: response.data.message,
        data: user,
      };
    }
    
    return { 
      success: false, 
      message: "Something went wrong during registration" 
    };
  } catch (error) {
    console.error("Registration error:", error );
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ error?: string; errors?: { msg: string }[] }>;
      if (axiosError.response) {
        const errorMessage =
          axiosError.response.data?.error ||
          (axiosError.response.data?.errors && axiosError.response.data.errors[0]?.msg) ||
          "Registration failed";
        return { success: false, message: errorMessage };
      } else if (axiosError.request) {
        return {
          success: false,
          message: "No response from server. Please check your connection.",
        };
      } else {
        return {
          success: false,
          message: axiosError.message || "An error occurred during registration",
        };
      }
    }
    return {
      success: false,
      message: (error as Error).message || "An unexpected error occurred",
    };
  }
};