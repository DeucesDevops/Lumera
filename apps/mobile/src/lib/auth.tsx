import * as SecureStore from "expo-secure-store";
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";
import { apiRequest } from "./api";

type AuthUser = {
  id: string;
  email: string;
};

type AuthResponse = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  accessToken: string | null;
  isDemo: boolean;
  isBootstrapping: boolean;
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  continueAsDemo: () => void;
  logout: () => Promise<void>;
};

const REFRESH_TOKEN_KEY = "lumera.refreshToken";
const AuthContext = createContext<AuthContextValue | null>(null);

async function getRefreshToken() {
  if (Platform.OS === "web") {
    return globalThis.localStorage?.getItem(REFRESH_TOKEN_KEY) ?? null;
  }

  return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}

async function setRefreshToken(refreshToken: string) {
  if (Platform.OS === "web") {
    globalThis.localStorage?.setItem(REFRESH_TOKEN_KEY, refreshToken);
    return;
  }

  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
}

async function deleteRefreshToken() {
  if (Platform.OS === "web") {
    globalThis.localStorage?.removeItem(REFRESH_TOKEN_KEY);
    return;
  }

  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function restoreSession() {
      const refreshToken = await getRefreshToken();

      if (!refreshToken) {
        if (mounted) {
          setIsBootstrapping(false);
        }
        return;
      }

      try {
        const response = await apiRequest<AuthResponse>("/auth/refresh", {
          method: "POST",
          body: JSON.stringify({ refreshToken }),
        });
        await setRefreshToken(response.refreshToken);

        if (mounted) {
          setUser(response.user);
          setAccessToken(response.accessToken);
          setIsDemo(false);
        }
      } catch {
        await deleteRefreshToken();
      } finally {
        if (mounted) {
          setIsBootstrapping(false);
        }
      }
    }

    void restoreSession();

    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      isDemo,
      isBootstrapping,
      async register(email, password) {
        const response = await apiRequest<AuthResponse>("/auth/register", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });
        await setRefreshToken(response.refreshToken);
        setUser(response.user);
        setAccessToken(response.accessToken);
        setIsDemo(false);
      },
      async login(email, password) {
        const response = await apiRequest<AuthResponse>("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });
        await setRefreshToken(response.refreshToken);
        setUser(response.user);
        setAccessToken(response.accessToken);
        setIsDemo(false);
      },
      continueAsDemo() {
        setUser({ id: "demo", email: "demo@lumera.local" });
        setAccessToken(null);
        setIsDemo(true);
      },
      async logout() {
        const refreshToken = await getRefreshToken();
        if (refreshToken && accessToken) {
          await apiRequest("/auth/logout", {
            method: "POST",
            body: JSON.stringify({ refreshToken }),
            accessToken,
          }).catch(() => undefined);
        }
        await deleteRefreshToken();
        setUser(null);
        setAccessToken(null);
        setIsDemo(false);
      },
    }),
    [accessToken, isBootstrapping, isDemo, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
}
