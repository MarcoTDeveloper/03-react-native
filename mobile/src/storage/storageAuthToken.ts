import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "./storageConfig";

type StorageAuthToken = {
  token: string
  refresh_token: string
}

export async function storageAuthTokenSave({ token, refresh_token }: StorageAuthToken) {
  await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, JSON.stringify({token, refresh_token}))
}

export async function storageAuthTokenGet() {
  const response = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN)

  const { token, refresh_token }: StorageAuthToken = response ? JSON.parse(response) : {}

  return {token, refresh_token}
}

export async function storageAuthTokenRemove() {
  await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN)
}