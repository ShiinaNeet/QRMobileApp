import React, { createContext, useContext, useState, useEffect } from "react";
import { Preferences } from "@capacitor/preferences";
import axios from "axios";

import { setupAxiosInterceptors } from "./axios";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (fullname: string, password: string) => Promise<ResponseObject>;
  logout: (callback: () => void) => Promise<void>;
}

// const AuthContext = createContext<AuthContextType>({
//     isAuthenticated: false,
//     login: async () => "Error",
//     logout: async () => {},
// });
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}
interface ResponseObject {
  error: boolean;
  status: string;
  message: string;
}
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [responseObject, setResponseObject] = useState({
    error: false,
    status: "",
    message: "",
  });

  const login = async (
    username: string,
    password: string
  ): Promise<ResponseObject> => {
    try {
      const response = await axios.post(
        "https://student-discipline-api-fmm2.onrender.com/auth/login",
        {
          username,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.status === "success") {
        if (response.data.account_type === "SECURITY") {
          await Preferences.set({
            key: "accessToken",
            value: response.data.access_token,
          });
          setupAxiosInterceptors(response.data.access_token);
          setIsAuthenticated(true);
          return {
            error: false,
            status: "success",
            message: response.data.description,
          };
        } else {
          return {
            error: true,
            status: "unauthorized",
            message: response.data.description,
          };
        }
      } else {
        return {
          error: true,
          status: "failed",
          message: response.data.description,
        };
      }
    } catch (error) {
      console.error("There was an error logging in!", error);
      return {
        error: true,
        status: "error",
        message: String(error),
      };
    }
  };

  const logout = async (callback: () => void) => {
    await Preferences.remove({ key: "accessToken" });
    setIsAuthenticated(false);
    callback();
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { value: accessToken } = await Preferences.get({
        key: "accessToken",
      });
      if (accessToken) {
        setupAxiosInterceptors(accessToken);
        setIsAuthenticated(true);
      }
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
