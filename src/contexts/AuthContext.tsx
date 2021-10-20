import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import { api } from '../services/api';

type User = {
  id: string;
  avatar_url: string;
  name: string;
  login: string;
};

type AuthResponse = {
  token: string;
  user: User;
};

type AuthContextData = {
  user: User | null;
  signInUrl: string;
  signOut: () => void;
};

interface AuthContextProviderProps {
  children: ReactNode;
}

const AuthContext = createContext({} as AuthContextData);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=${
    import.meta.env.VITE_GITHUB_CLIENT_ID
  }`;

  async function signIn(githubCode: string) {
    try {
      const response = await api.post<AuthResponse>('/authenticate', {
        code: githubCode,
      });

      const { token, user: foundUser } = response.data;

      localStorage.setItem('@nlw_heat:token', token);

      api.defaults.headers.common.authorization = `Bearer ${token}`;

      setUser(foundUser);
    } catch (error) {
      console.log(error);
    }
  }

  function signOut() {
    setUser(null);
    localStorage.removeItem('@nlw_heat:token');
  }

  useEffect(() => {
    const token = localStorage.getItem('@nlw_heat:token');

    if (token) {
      api.defaults.headers.common.authorization = `Bearer ${token}`;

      api.get<User>('profile').then(response => setUser(response.data));
    }
  }, []);

  useEffect(() => {
    const url = window.location.href;
    const hasGithubCode = url.includes('?code=');

    if (hasGithubCode) {
      const [urlWithoutCode, githubCode] = url.split('?code=');

      window.history.pushState({}, '', urlWithoutCode);

      signIn(githubCode);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, signInUrl, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
