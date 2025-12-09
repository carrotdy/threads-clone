import { Redirect, router } from "expo-router";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Login() {
    const insets = useSafeAreaInsets();
    const isLoggedIn = false;

    const onLogin = () => {
        console.log("login")
        fetch("/login", {
            method: "POST",
            body: JSON.stringify({
                username: "zerocho",
                password: "1234"
            })
        })
            .then((res) => {
                console.log("res", res, res.status);

                if(res.status >= 400) {
                    return Alert.alert("ERROR", "Invalid credentials")
                }
                return res.json();
            })
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.error(error)
            });
    }

    if (isLoggedIn) {
        return <Redirect href="/(tabs)" />;
    }

    return (
        <View style={{ paddingTop: insets.top }}>
            <Pressable onPress={() => router.back()}>
                <Text>Back</Text>
            </Pressable>
            <Pressable
                onPress={onLogin}
                style={styles.loginButton}
            >
                <Text style={styles.loginButtonText}>Login</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    loginButton: {
        backgroundColor: "blue",
        padding: 10,
        borderRadius: 5,
        width: 100,
        alignItems: "center",
    },
    loginButtonText: {
        color: "white",
    },
});