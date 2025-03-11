// components/CaptainProtectWrapper.tsx
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CaptainDataContext } from "../context/CaptionContext"; // Fix typo in path
import axios from "axios";

const CaptainProtectWrapper = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const context = useContext(CaptainDataContext);
  const [isLoading, setLoading] = useState(true);

  if (!context) {
    throw new Error("CaptainProtectWrapper must be used within a CaptainContext");
  }
  const { setCaptain } = context;

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
        withCredentials: true, // Send cookies with request
      })
      .then((res) => {
        if (res.status === 200) {
          setCaptain(res.data.caption); // Match API response structure
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Profile fetch error:", err);
        navigate("/captain-login");
      });
  }, [navigate, setCaptain]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};
  export default CaptainProtectWrapper;