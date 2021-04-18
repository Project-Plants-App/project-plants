import {Icon, Text, useTheme} from "@ui-kitten/components";
import React from "react";
import {StyleProp, StyleSheet, View, ViewStyle} from "react-native";

type BadgeProps = {
    title: string,
    icon?: string,
    style?: StyleProp<ViewStyle>
}

export default ({title, icon, style}: BadgeProps) => {
    const theme = useTheme();

    return (
        <View style={[style, styles.view, {backgroundColor: theme['background-basic-color-3']}]}>
            {icon &&
            <Icon style={styles.icon} name={icon} fill={theme['text-basic-color']}/>
            }
            <Text style={styles.text}>{title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 50,
        paddingHorizontal: 6,
        paddingVertical: 3
    },
    icon: {
        width: 12,
        height: 12,
        marginRight: 3
    },
    text: {

        fontSize: 12
    }
})