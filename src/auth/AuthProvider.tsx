import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { Preferences } from "@capacitor/preferences";
import axios from "axios";
import { useHistory } from "react-router-dom";

import { setupAxiosInterceptors } from "./axios";
import { key } from "ionicons/icons";

interface AuthContextType {
  userType: string;
  isAuthenticated: boolean;
  setUserType: (userType: string) => void;
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
  const [userType, setUserType] = useState("");
  const login = async (
    username: string,
    password: string
  ): Promise<ResponseObject> => {
    try {
      const response = await axios.post(
        "auth/login",
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
        if (
          response.data.account_type === "SECURITY" ||
          response.data.account_type === "PROFESSOR"
        ) {
          setUserType(response.data.account_type);
          await Preferences.set({
            key: "userType",
            value: response.data.account_type,
          });
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
      const { value: loggedInUserType } = await Preferences.get({
        key: "userType",
      });
      setUserType(loggedInUserType || "");
    };
    checkAuth();
  }, []);

  const history = useHistory();
  const lastInteractionTime = useRef(Date.now());
  const logoutTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    const IDLE_TIMEOUT = 60000; // 1 minute in milliseconds

    const performLogout = () => {
      console.log("[AutoLogout] Logging out due to inactivity");
      logout(() => {
        history.push("/login", {
          message: "You are inactive for 1 minute, we've logged you out",
        });
      });
    };

    const resetTimer = () => {
      lastInteractionTime.current = Date.now();
      console.log("[AutoLogout] Timer reset at", new Date().toLocaleTimeString());
    };

    // Check every second if we've exceeded the idle timeout
    const intervalId = setInterval(() => {
      const elapsed = Date.now() - lastInteractionTime.current;
      if (elapsed >= IDLE_TIMEOUT) {
        console.log("[AutoLogout] Idle timeout reached, elapsed:", elapsed);
        clearInterval(intervalId);
        performLogout();
      }
    }, 1000);

    const handleAppStateChange = (state: any) => {
      console.log("[AutoLogout] App state changed:", state.isActive ? "active" : "background");
      if (state.isActive) {
        // App has resumed. Check if we should have logged out.
        const timeSinceLastInteraction = Date.now() - lastInteractionTime.current;
        if (timeSinceLastInteraction >= IDLE_TIMEOUT) {
          performLogout();
        }
      }
    };

    // Mobile-friendly events
    const events = [
      "touchstart",
      "touchmove", 
      "touchend",
      "click",
      "keydown",
      "scroll",
      "mousemove",
    ];

    // Add event listeners
    events.forEach((event) => window.addEventListener(event, resetTimer, { passive: true }));
    
    // Add Capacitor App State listener
    import('@capacitor/app').then(({ App }) => {
      App.addListener('appStateChange', handleAppStateChange);
    });

    // Start initial timer
    resetTimer();

    // Cleanup
    return () => {
      clearInterval(intervalId);
      events.forEach((event) =>
        window.removeEventListener(event, resetTimer)
      );
      import('@capacitor/app').then(({ App }) => {
        App.removeAllListeners();
      });
    };
  }, [isAuthenticated, history]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, userType, setUserType }}
    >
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
