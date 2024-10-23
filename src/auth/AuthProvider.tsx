import React, { createContext, useContext, useState, useEffect } from "react";
import { Preferences } from "@capacitor/preferences";
import axios from "axios";

import { setupAxiosInterceptors } from "./axios";

interface AuthContextType {
    isAuthenticated: boolean;
    login: (fullname: string, password: string) => Promise<string>;
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

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = async (
        fullname: string,
        password: string
    ): Promise<string> => {
        try {
            const response = await axios.post(
                "https://student-discipline-api-fmm2.onrender.com/auth/login",
                {
                    fullname,
                    password,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.data.status === "success") {
                await Preferences.set({
                    key: "accessToken",
                    value: response.data.api_token,
                });
                setupAxiosInterceptors(response.data.api_token);
                setIsAuthenticated(true);
                return "success"; // Return "success" to indicate successful login
            } else {
                console.log("Failed to login: ", response.data.message);
                return "Failed"; // Return "Failed" on unsuccessful login
            }
        } catch (error) {
            console.error("There was an error logging in!", error);
            return "Error";
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
