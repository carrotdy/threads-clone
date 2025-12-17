import AsyncStorage from '@react-native-async-storage/async-storage';
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Asset } from "expo-asset";
import Constants from 'expo-constants';
import { router, Stack } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from 'expo-status-bar';
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Alert, Animated, StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

SplashScreen.preventAutoHideAsync().catch(() => {
})

export interface User {
  id: string;
  name: string;
  profileImageUrl: string;
  description: string;
  link?: string;
  showInstagramBadge?: boolean;
  isPrivate?: boolean;
}

export const AuthContext = createContext<{
  user: User | null;
  login?: () => Promise<any>;
  logout?: () => Promise<any>;
  updateUser?: (user: User) => void;
}>({
  user: null,
});

function AnimatedAppLoader({
  children, image
}: {
  children: React.ReactNode,
  image: number
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isSplashReadey, setSplashReady] = useState(false)

  useEffect(() => {
    async function prepare() {
      await Asset.loadAsync(image);
      setSplashReady(true);
    }
    prepare();
  }, [image])

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

  const updateUser = (user: User | null) => {
    setUser(user);

    if (user) {
      AsyncStorage.setItem("user", JSON.stringify(user));
    } else {
      AsyncStorage.removeItem("user");
    }
  }

  if (!isSplashReadey) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      <AnimatedSplashScreen image={image}>{children}</AnimatedSplashScreen>
    </AuthContext.Provider>
  )
}

function AnimatedSplashScreen({
  children,
  image
}: {
  children: React.ReactNode;
  image: number
}) {
  const [isAppReady, setAppReady] = useState(false);
  const [isSplashAnimationComplete, setAnimationComplete] = useState(false);
  const animation = useRef(new Animated.Value(1)).current;
  const { updateUser } = useContext(AuthContext);

  useEffect(() => {
    if (isAppReady) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true
      }).start(() => setAnimationComplete(true));
    }
  }, [isAppReady])

  const onImageLoaded = async () => {
    try {
      //데이터 준비
      await Promise.all([
        AsyncStorage.getItem("user").then((user) => {
          updateUser?.(user ? JSON.parse(user) : null);
        })
      ])
      await SplashScreen.hideAsync();
    } catch (e) {
      console.error(e)
    } finally {
      setAppReady(true);
    }
  }

  const rotateValue = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["360deg", "0deg"]
  })

  return (
    <View style={{ flex: 1 }}>
      {isAppReady && children}
      {!isSplashAnimationComplete && (
        <Animated.View pointerEvents={"none"}
          style={[{
            ...StyleSheet.absoluteFillObject,
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: Constants.expoConfig?.splash?.backgroundColor || '#ffffff',
            opacity: animation,
          }]}
        >
          <Animated.Image
            source={image}
            style={{
              resizeMode: Constants.expoConfig?.splash?.resizeMode || "contain",
              width: Constants.expoConfig?.splash?.imageWidth || 200,
              transform: [
                { scale: animation },
                { rotate: rotateValue }
              ]
            }}
            onLoadEnd={onImageLoaded}
            fadeDuration={0}
          />
        </Animated.View>
      )}
    </View>
  )
}

// stack처럼 쌓이게됨
export default function RootLayout() {
  const WhiteTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "#fff",
    },
  };

  return (
    <SafeAreaProvider>
      <AnimatedAppLoader image={require("../assets/images/react-logo.png")}>
        <ThemeProvider value={WhiteTheme}>
          <StatusBar style="auto" animated />
          <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="modal" options={{ presentation: "modal" }} />
            </Stack>
          </SafeAreaView>
        </ThemeProvider>
      </AnimatedAppLoader>
    </SafeAreaProvider>
  )
}