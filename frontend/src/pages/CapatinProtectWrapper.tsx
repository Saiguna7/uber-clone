// components/CaptainProtectWrapper.tsx
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CaptainDataContext } from "../context/CaptionContext"; // Fix typo in path
import axios from "axios";

const CaptainProtectWrapper = ({ children }: { children: React.ReactNode }) => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const context = useContext(CaptainDataContext);
    const [isLoading, setLoading] = useState(true);
  
    if (!context) {
      throw new Error("CaptainProtectWrapper must be used within a CaptainContext");
    }
    const { setCaptain } = context;
  
    useEffect(() => {
      if (!token) {
        navigate("/captain-login");
        return;
      }
  
      axios
        .get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            setCaptain(res.data);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.error("Profile fetch error:", err);
          localStorage.removeItem("token");
          navigate("/captain-login");
        });
    }, [token, navigate, setCaptain]);
  
    if (isLoading) {
      return <div>Loading...</div>;
    }
  
    if (!token) {
      return null;
    }
  
    return <>{children}</>;
  };
  
  export default CaptainProtectWrapper;