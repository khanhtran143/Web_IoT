import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile } from "../types/user";
import { authService } from "../services/authService";
import { userService } from "../services/userService";

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => authService.getCurrentUser());

  useEffect(() => {
    userService.getProfile().then((u) => {
      if (u) {
        setUser(u);
        localStorage.setItem("user", JSON.stringify(u));
      }
    }).catch(() => {});
  }, []);

  const login = async (email: string, pass: string) => {
    const result = await authService.login(email, pass);
    setUser(result.user);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const refreshProfile = async () => {
    try {
      const u = await userService.getProfile();
      if (u) {
        setUser(u);
        localStorage.setItem("user", JSON.stringify(u));
      }
    } catch (e) {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
