// actions/captain-signup-action.ts
import axios, { AxiosError } from "axios";

interface ServerUserResponse {
  message: string;
  token: string;
}

interface Captain {
  email: string;
  fullname: {
    firstname: string;
    lastname: string;
  };
  vehicle: {
    vehicleType: "car" | "motorcycle" | "auto";
    color: string;
    plate: string;
    capacity: number;
  };
}

interface SignupResponse {
  success: boolean;
  message: string;
  data?: Captain;
  token?: string;
}

export const SignUpCatain = async (formData: FormData): Promise<SignupResponse> => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const firstname = formData.get("firstname") as string;
  const lastname = formData.get("lastname") as string;
  const vehicleTypeRaw = formData.get("vehicleType") as string;
  const vehicleColor = formData.get("vehicleColor") as string;
  const vehiclePlate = formData.get("vehiclePlate") as string;
  const vehicleCapacity = parseInt(formData.get("vehicleCapacity") as string, 10); // Convert to number
  const validVehicleTypes = ["car", "motorcycle", "auto"] as const;
  const vehicleType: "car" | "motorcycle" | "auto" = validVehicleTypes.includes(
    vehicleTypeRaw as never
  )
    ? (vehicleTypeRaw as "car" | "motorcycle" | "auto")
    : "car";
  if (!validVehicleTypes.includes(vehicleTypeRaw as never)) {
    return { success: false, message: "Invalid vehicle type" };
  }
  if (
    !email ||
    !password ||
    !firstname ||
    !lastname ||
    !vehicleCapacity ||
    !vehicleColor ||
    !vehicleType ||
    !vehiclePlate
  ) {
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
      import.meta.env.VITE_BASE_URL + "/captains/register",
      {
        email,
        password,
        fullname: { firstname, lastname },
        vehicle: {
          vehicleType,
          color: vehicleColor,
          plate: vehiclePlate,
          capacity: vehicleCapacity, // Now a number
        },
      },{withCredentials:true}
    );

    console.log("Full server response:", response.data);
    if (response.status === 201) {
      const captain: Captain = {
        email,
        fullname: {
          firstname,
          lastname,
        },
        vehicle: {
          vehicleType,
          color: vehicleColor,
          plate: vehiclePlate,
          capacity: vehicleCapacity,
        },
      };
      console.log("Captain registered successfully:", captain);
      return {
        success: true,
        message: response.data.message,
        data: captain,
      };
    }

    return {
      success: false,
      message: "Something went wrong during registration",
    };
  } catch (error) {
    console.error("Registration error:", error);
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