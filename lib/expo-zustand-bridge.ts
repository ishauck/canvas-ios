import { StateStorage } from "zustand/middleware";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

export const expoStorage: StateStorage = {
    getItem: async (name) => {
        return await AsyncStorage.getItem(name);
    },
    setItem: async (name, value) => {
        await AsyncStorage.setItem(name, value);
    },
    removeItem: async (name) => {
        await AsyncStorage.removeItem(name);
    },
}

export const secureStorage: StateStorage = {
    getItem: async (name) => {
        return await SecureStore.getItemAsync(name);
    },
    setItem: async (name, value) => {
        await SecureStore.setItemAsync(name, value);
    },
    removeItem: async (name) => {
        await SecureStore.deleteItemAsync(name);
    },
}