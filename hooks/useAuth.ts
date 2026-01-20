import type { User, UserRole } from '@/types/user';
import { useCallback, useEffect, useState } from 'react';

let memoryUser: User | null = null;

interface UseAuthResult {
  user: User | null;
  register: (params: { name: string; role: UserRole }) => void;
  updateUser: (patch: Partial<User>) => void;
  logout: () => void;
}

export function useAuth(): UseAuthResult {
  const [user, setUser] = useState<User | null>(memoryUser);

  useEffect(() => {
    setUser(memoryUser);
  }, []);

  const register = useCallback((params: { name: string; role: UserRole }) => {
    const next: User = {
      id: String(Date.now()),
      name: params.name.trim(),
      role: params.role,
    };
    memoryUser = next;
    setUser(next);
  }, []);

  const updateUser = useCallback((patch: Partial<User>) => {
    if (!memoryUser) return;
    memoryUser = { ...memoryUser, ...patch };
    setUser(memoryUser);
  }, []);

  const logout = useCallback(() => {
    memoryUser = null;
    setUser(null);
  }, []);

  return { user, register, updateUser, logout };
}

