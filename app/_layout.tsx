import AsyncStorage from '@react-native-async-storage/async-storage';
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { router, Stack } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { createContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

interface User {
  id: string;
  name: string;
  profileImageUrl: string;
  description: string;
}

export const AuthContext = createContext<{
  user: User | null;
  login?: () => Promise<any>;
  logout?: () => Promise<any>;
}>({
  user: null,
});

// stack처럼 쌓이게됨
export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);

  const WhiteTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "#fff",
    },
  };

  const login = () => {
    return fetch("/login", {
      method: "POST",
      body: JSON.stringify({
        username: "zerocho",
        password: "1234",
        description: "🐢 lover, programmer, youtuber",
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

  //로그인 유지
  useEffect(() => {
    AsyncStorage.getItem("user").then((user) => {
      setUser(user ? JSON.parse(user) : null)
    })
    //TODO: AccessToken 유효한지 검사
  }, [])

  return (
    <SafeAreaProvider>
      <ThemeProvider value={WhiteTheme}>
        <AuthContext.Provider value={{ user, login, logout }}>
          <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="modal" options={{ presentation: "modal" }} />
            </Stack>
          </SafeAreaView>
        </AuthContext.Provider>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}