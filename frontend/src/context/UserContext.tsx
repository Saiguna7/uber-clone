// UserContext.tsx
import { createContext, useState, ReactNode } from "react";

interface User {
  email: string;
  fullname: {
    firstname: string;
    lastname: string;
  };
}

interface UserDataContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

// Define the context with a default value
// eslint-disable-next-line react-refresh/only-export-components
export const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const UserDataProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserDataContext.Provider value={{ user, setUser }}>
      {children}
    </UserDataContext.Provider>
  );
};