import type { UserDTO } from "@dtos/userDTO";
import { api } from "@services/api";
import { storageAuthTokenGet, storageAuthTokenRemove, storageAuthTokenSave } from "@storage/storageAuthToken";
import { storageUserGet, storageUserRemove, storageUserSave } from "@storage/storageUser";
import { createContext, useEffect, useState, type ReactNode } from "react";

export type AuthContextData = {
  user: UserDTO
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  updateUserProfile: (userUpdated: UserDTO) => Promise<void>
  isLoadingUserStorage: boolean
}

type AuthContextProvider = {
  children: ReactNode
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export function AuthContextProvider({ children }: AuthContextProvider) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO)
  const [isLoadingUserStorage, setIsLoadingUserStorage] = useState(true)

  async function userAndTokenUpdate(user: UserDTO, token: string) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(user)
  }

   async function storageUserAndTokenSave(user: UserDTO, token: string, refresh_token: string) {
    try {
      setIsLoadingUserStorage(true)
      await storageUserSave(user)
      await storageAuthTokenSave({token, refresh_token})
      
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorage(false)
    }
   }

  async function signIn(email: string, password: string) {
    try {
      const { data } = await api.post('/sessions', {email, password})
  
      console.log(data)

      if (data.user && data.token && data.refresh_token) {
        await storageUserAndTokenSave(data.user, data.token, data.refresh_token)
        userAndTokenUpdate(data.user, data.token)
      }
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorage(false)
    }
  }

  async function signOut() {
    try {
      setIsLoadingUserStorage(true)
      setUser({} as UserDTO)
      await storageUserRemove()
      await storageAuthTokenRemove()
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorage(false)
    }
  }

  async function updateUserProfile(userUpdated: UserDTO) {
    try {
      setUser(userUpdated)
      await storageUserSave(userUpdated)
    } catch (error) {
      throw error
    }
  }

  async function loadUserData() {
    try {
      setIsLoadingUserStorage(true)
      const userLogged = await storageUserGet()
      const { token } = await storageAuthTokenGet()
  
      if (token && userLogged) {
        userAndTokenUpdate(userLogged, token)
      }
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorage(false)
    }
  }

  useEffect(() => {
    loadUserData()  
  },[])

  useEffect(() => {
    const subscribe = api.registerInterceptTokenManager(signOut)

    return () => {
      subscribe()
    }
  },[signOut])

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isLoadingUserStorage, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  )
}