import { create } from 'zustand'

const useStore = create((set) => ({
    car: 0,
    updateBears: (newcar) => set({ car: newcar }),
}))