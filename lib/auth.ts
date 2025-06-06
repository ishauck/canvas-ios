import * as SecureStore from 'expo-secure-store';

const ACCOUNT_KEY = 'account';

export async function removeAccountKey(id: string) {
  await SecureStore.deleteItemAsync(`${ACCOUNT_KEY}:${id}`);
}

export async function saveAccountKey(id: string, value: string) {
  await SecureStore.setItemAsync(`${ACCOUNT_KEY}:${id}`, value);
}

export async function getAccountKey(id: string) {
  return await SecureStore.getItemAsync(`${ACCOUNT_KEY}:${id}`);
}
