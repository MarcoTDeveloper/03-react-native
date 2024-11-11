import type { UserDTO } from "@dtos/userDTO";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "./storageConfig";

export async function storageUserSave(user: UserDTO) {
  await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
}

export async function storageUserGet() {
  const storage = await AsyncStorage.getItem(STORAGE_KEYS.USER)

  const user: UserDTO = storage ? JSON.parse(storage) : {}

  return user
}

export async function storageUserRemove() {
  await AsyncStorage.removeItem(STORAGE_KEYS.USER)
}