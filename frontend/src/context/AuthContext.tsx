import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react"

type User = {
    _id: string;
    name: string;
    email: string;
  }; 
  
  type AuthContextType = {
    authUser: User | null;
    setAuthUser: React.Dispatch<React.SetStateAction<User | null>>;
    loading : boolean
  };

  export const AuthContext = createContext<AuthContextType | null>(null);

  export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuthContext must be used within AuthContextProvider");
    return context;
  };
  
  export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [authUser, setAuthUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
      checkAuthStatus();
    }, []);
  
    const checkAuthStatus = async () => {
      try {
        const res = await axios.get(`${backendUrl}/auth/me`, { withCredentials: true });
        console.log(res.data)
        setAuthUser(res.data.user);
      } catch (error) {
        setAuthUser(null);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <AuthContext.Provider value={{ authUser, setAuthUser, loading }}>
        {children}
      </AuthContext.Provider>
    );
  };