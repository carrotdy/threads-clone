import { StyleSheet, Text, useColorScheme, View } from "react-native";

export default function Post() {
    const colorScheme = useColorScheme();

    return (
        <View>
            <Text
                style={[
                    styles.postButtonText,
                    colorScheme === "dark"
                        ? styles.postButtonTextDark
                        : styles.postButtonTextLight,
                ]}
            >
                게시글 상세 페이지입니다.
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    postButtonText: {
        fontSize: 16,
        fontWeight: "800",
    },
    postButtonTextLight: {
        color: "black",
    },
    postButtonTextDark: {
        color: "white",
    },
});