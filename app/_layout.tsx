import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, Stack } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { createContext, useState } from "react";
import { Alert } from "react-native";

type User = {
  username: string;
  description: string;
  profileImageUrl: string;
};

type AuthContextType = {
  user: User | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => { },
  logout: async () => { },
});

// stack처럼 쌓이게됨
export default function RootLayout() {
  const [user, setUser] = useState(null);

  const login = () => {
    return fetch("/login", {
      method: "POST",
      body: JSON.stringify({
        username: "dayoung",
        password: "1234",
        description: "lover, programmer",
        profileImageUrl:
          "https://avatars.githubusercontent.com/u/885857?v=4",
      })
    })
      .then((res) => {
        console.log("res", res, res.status);

        if (res.status >= 400) {
          return Alert.alert("ERROR", "Invalid credentials")
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setUser(data.user);

        return Promise.all([
          SecureStore.setItemAsync("accessToken", data.accessToken),
          SecureStore.setItemAsync("refreshToken", data.refreshToken),
          AsyncStorage.setItem("user", JSON.stringify(data.user)),
        ]);
      })
      .then(() => {
        router.push("/(tabs)");
      })
      .catch((error) => {
        console.error(error)
      });
  }

  const logout = async () => {
    setUser(null);

    await Promise.all([
      SecureStore.deleteItemAsync("accessToken"),
      SecureStore.deleteItemAsync("refreshToken"),
      AsyncStorage.removeItem("user"),
    ]);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
    </AuthContext.Provider>
  )
}