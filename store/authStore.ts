import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
    email: string;
    password: string;
}

interface AuthState {
    user: User | null;
    isLoading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isLoading: false,
            signIn: async (email: string, password: string) => {
                set({ isLoading: true });
                try {
                    // In a real app, you would validate against a backend
                    set({ user: { email, password } });
                } finally {
                    set({ isLoading: false });
                }
            },
            signUp: async (email: string, password: string) => {
                set({ isLoading: true });
                try {
                    // In a real app, you would create a user in a backend
                    set({ user: { email, password } });
                } finally {
                    set({ isLoading: false });
                }
            },
            signOut: async () => {
                set({ isLoading: true });
                try {
                    set({ user: null });
                } finally {
                    set({ isLoading: false });
                }
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
); 