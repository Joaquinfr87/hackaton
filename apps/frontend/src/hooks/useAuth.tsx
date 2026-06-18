import {
  createContext,
  useContext,
  useCallback,
  type ReactNode,
} from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseMutateAsyncFunction,
} from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  roles: string[];
}

interface AuthResponse {
  accessToken: string;
  user: User;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: UseMutateAsyncFunction<AuthResponse, Error, { email: string; password: string }>;
  register: UseMutateAsyncFunction<AuthResponse, Error, { name: string; email: string; password: string; phone?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function getToken(): string | null {
  return localStorage.getItem("auth_token");
}

function setToken(token: string | null) {
  if (token) {
    localStorage.setItem("auth_token", token);
  } else {
    localStorage.removeItem("auth_token");
  }
}

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Error ${res.status}`);
  }

  return res.json();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery<User | null>({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      try {
        const data = await apiFetch<{ id: string; name: string; email: string; roles: string[] }>("/auth/me");
        return {
          id: data.id,
          name: data.name,
          email: data.email,
          phone: null,
          roles: data.roles,
        };
      } catch {
        setToken(null);
        return null;
      }
    },
    enabled: !!getToken(),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const loginMutation = useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      apiFetch<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (data) => {
      setToken(data.accessToken);
      queryClient.setQueryData(["auth", "me"], data.user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: { name: string; email: string; password: string; phone?: string }) =>
      apiFetch<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (data) => {
      setToken(data.accessToken);
      queryClient.setQueryData(["auth", "me"], data.user);
    },
  });

  const logout = useCallback(() => {
    setToken(null);
    queryClient.setQueryData(["auth", "me"], null);
    queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
  }, [queryClient]);

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isAuthenticated: !!user && !isError,
        isLoading,
        login: loginMutation.mutateAsync,
        register: registerMutation.mutateAsync,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return ctx;
}
