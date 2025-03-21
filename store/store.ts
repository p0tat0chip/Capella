import { create } from 'zustand';

export const useStore = create((set, get) => ({
    car: 0,
    updateCar: (newCar) => set({ car: newCar }),
    button: true,
    updateButton: () => set((state) => ({ button: !state.button })),
    prompt: "",
    setPrompt: (text) => set({ prompt: text }),
    destination: "",
    setDestination: (text) => set({ destination: text }),
    safetyIndex: "",
    crimeFactor: "",
    lightingFactor: "",
    surveillanceFactor: "",
    emergencyFactor: "",
    latitude: 0,
    longitude: 0,
    setLatitude: (lat) => set({ latitude: lat }),
    setLongitude: (long) => set({ longitude: long }),
    updateSafetyData: (safetyData) => {
        // Construct the new state from incoming data with defaults
        const newState = {
            safetyIndex: safetyData.safetyIndex || "",
            crimeFactor: safetyData.crimeFactor || "",
            lightingFactor: safetyData.lightingFactor || "",
            surveillanceFactor: safetyData.surveillanceFactor || "",
            emergencyFactor: safetyData.emergencyFactor || "",
        };

        // Get the current state
        const {
            safetyIndex: currentSafetyIndex,
            crimeFactor: currentCrimeFactor,
            lightingFactor: currentLightingFactor,
            surveillanceFactor: currentSurveillanceFactor,
            emergencyFactor: currentEmergencyFactor,
        } = get();

        // Only update if at least one field is different
        if (
            currentSafetyIndex !== newState.safetyIndex ||
            currentCrimeFactor !== newState.crimeFactor ||
            currentLightingFactor !== newState.lightingFactor ||
            currentSurveillanceFactor !== newState.surveillanceFactor ||
            currentEmergencyFactor !== newState.emergencyFactor
        ) {
            set(newState);
        }
    },
}));

export const useDestinationStore = create((set) => ({
    destination: "",
    setDestination: (text) => set({ destination: text }),
}));

export const useLatitudeStore = create((set) => ({
    latitude: 0,
    setLatitude: (lat) => set({ latitude: lat }),
}));

export const useLongitudeStore = create((set) => ({
    longitude: 0,
    setLongitude: (long) => set({ longitude: long }),
}));
export const useSafetyAnalysisStore = create((set) => ({
    analysis: null,
    setAnalysis: (data) => set({ analysis: data }),
}));