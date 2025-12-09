import { BlurView } from "expo-blur";
import { usePathname, useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
    const router = useRouter();
    const pathname = usePathname();
    const insets = useSafeAreaInsets();
    const isLoggedIn = false;

    return (
        <View style={[style.container, { paddingTop: insets.top + 20 }]}>
            <BlurView style={style.header} intensity={70}>
                <Image
                    source={require("../../../assets/images/react-logo.png")}
                    style={style.headerLogo}
                />
                {!isLoggedIn &&
                    <TouchableOpacity
                        onPress={() => router.navigate(`/login`)}
                        style={style.loginButton}
                    >
                        <Text style={style.loginButtonText}>로그인</Text>
                    </TouchableOpacity>
                }
            </BlurView>
            {isLoggedIn && (
                <View style={style.tabContainer}>
                    <View style={style.tab}>
                        <TouchableOpacity
                            onPress={() => router.push(`/`)}>
                            <Text style={{ color: pathname === "/" ? "red" : "black" }}>For you</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={style.tab}>
                        <TouchableOpacity
                            onPress={() => router.push(`/following`)}>
                            <Text style={{ color: pathname === "/" ? "black" : "red" }}>Following</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
            <View>
                <TouchableOpacity
                    onPress={() => router.push(`/@dayoung/post/1`)}
                >
                    <Text>게시글1</Text>
                </TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity
                    onPress={() => router.push(`/@dayoung/post/2`)}
                >
                    <Text>게시글2</Text>
                </TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity
                    onPress={() => router.push(`/@dayoung/post/3`)}
                >
                    <Text>게시글3</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1
    },
    tabContainer: {
        flexDirection: "row"
    },
    tab: {
        flex: 1,
        alignItems: "center"
    },
    header: {
        alignItems: "center",
    },
    headerLogo: {
        width: 42,
        height: 42
    },
    loginButton: {
        position: "absolute",
        right: 10,
        top: 0,
        backgroundColor: "black",
        borderWidth: 1,
        borderColor: "black",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    loginButtonText: {
        color: "white",

    }
})