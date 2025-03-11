import { createContext, useState, ReactNode } from "react";

interface Captain {
  email: string;
  fullname: {
    firstname: string;
    lastname: string;
  };
  vehicle: {
    color: string;
    plate: string;
    capacity: number;
    vehicleType: "car" | "motorcycle" | "auto";// Union type, not array
  };
}

type CaptainDataContextType = {
  captain: Captain | null;
  setCaptain: (captain: Captain | null) => void;
};

export const CaptainDataContext = createContext<CaptainDataContextType | undefined>(undefined);

const CaptainContext = ({ children }: { children: ReactNode }) => {
  const [captain, setCaptain] = useState<Captain | null>(null);

  return (
    <CaptainDataContext.Provider value={{ captain, setCaptain }}>
      {children}
    </CaptainDataContext.Provider>
  );
};

export default CaptainContext;