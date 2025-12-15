import SideMenu from "@/components/SideMenu";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@react-navigation/elements";
import {
    type MaterialTopTabNavigationEventMap,
    type MaterialTopTabNavigationOptions,
    createMaterialTopTabNavigator,
} from "@react-navigation/material-top-tabs";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { withLayoutContext } from "expo-router";
import { useContext, useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthContext } from "../../_layout";

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
    MaterialTopTabNavigationOptions,
    typeof Navigator,
    TabNavigationState<ParamListBase>,
    MaterialTopTabNavigationEventMap
>(Navigator);

export default function TabLayout() {
    const insets = useSafeAreaInsets();
    const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
    const { user } = useContext(AuthContext);
    const isLoggedIn = !!user;

    return (
        <View
            style={[
                styles.container,
                { paddingTop: insets.top, paddingBottom: insets.bottom },
            ]}>
            <View style={styles.header}>
                {isLoggedIn && (
                    <Pressable
                        style={styles.menuButton}
                        onPress={() => {
                            setIsSideMenuOpen(true);
                        }}
                    >
                        <Ionicons name="menu" size={24} color="black" />
                    </Pressable>
                )}
                <SideMenu
                    isVisible={isSideMenuOpen}
                    onClose={() => setIsSideMenuOpen(false)}
                />
            </View>
            <View style={styles.profile}>
                <View style={styles.profileHeader}>
                    <Image
                        source={{ uri: user?.profileImageUrl }}
                        style={styles.profileAvatar}
                    />
                    <Text>{user?.name}</Text>
                    <Text>{user?.id}</Text>
                    <Text>{user?.description}</Text>
                </View>
            </View>
            <MaterialTopTabs
                screenOptions={{
                    lazy: true,
                    tabBarStyle: {
                        backgroundColor: "white",
                        shadowColor: "transparent",
                        position: "relative",
                    },
                    tabBarPressColor: "transparent",
                    tabBarActiveTintColor: "#555",
                    tabBarIndicatorStyle: {
                        backgroundColor: "black",
                        height: 1,
                    },
                    tabBarIndicatorContainerStyle: {
                        backgroundColor: "#aaa",
                        position: "absolute",
                        top: 49,
                        height: 1,
                    }
                }}>
                <MaterialTopTabs.Screen name="index" options={{ title: "Threads" }} />
                <MaterialTopTabs.Screen name="replies" options={{ title: "Replies" }} />
                <MaterialTopTabs.Screen name="reposts" options={{ title: "Reposts" }} />
            </MaterialTopTabs>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        justifyContent: "flex-end",
    },
    tabBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20
    },
    profile: {
        marginTop: 20
    },
    menuButton: {},
    profileHeader: {},
    profileAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
});