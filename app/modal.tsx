import { useRouter } from "expo-router";
import { Pressable, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function modal() {
    const router = useRouter();

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>I'm a modal</Text>
            <Pressable onPress={() => router.back()}>
                <Text>Close</Text>
            </Pressable>
        </View>
    )
}