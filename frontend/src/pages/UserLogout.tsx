import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const UserLogout = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/logout`,
        {},
        {
          withCredentials: true, // Send the httpOnly cookie
        }
      );

      if (response.status === 200) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      setError("Failed to log out. Please try again.");
      // Redirect anyway since server might have cleared the cookie
      navigate("/login");
    }
  };

  return (
    <div>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
      {error && (
        <div className="mt-2 text-red-700 bg-red-100 border border-red-400 px-4 py-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default UserLogout;