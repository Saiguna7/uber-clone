import axios from "axios"
import { useNavigate } from "react-router-dom"
const UserLogout = () => {
    const navigate = useNavigate();
  
    const handleLogout = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login"); // Redirect if no token
        return;
      }
  
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.status === 201) { // Note: 200 is more common for logout success
          localStorage.removeItem("token");
          navigate("/login");
        }
      } catch (error) {
        console.error("Logout failed:", error);
        // Optionally handle error (e.g., show a message)
        localStorage.removeItem("token"); // Clear token anyway for safety
        navigate("/login");
      }
    };
  
    return (
      <div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    );
  };
  
  export default UserLogout;
