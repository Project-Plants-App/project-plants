import {Icon, Text, useTheme} from "@ui-kitten/components";
import React from "react";
import {StyleProp, StyleSheet, View, ViewStyle} from "react-native";
import {ChildrenProp} from "@ui-kitten/components/devsupport";

type BadgeProps = {
    title?: string,
    icon?: string,
    style?: StyleProp<ViewStyle>,
    children?: ChildrenProp
}

export default ({title, icon, style, children}: BadgeProps) => {

    const theme = useTheme();

    return (
        <View style={[style, styles.view, {backgroundColor: theme['background-basic-color-3']}]}>
            {icon &&
            <Icon style={styles.icon} name={icon} fill={theme['text-basic-color']}/>
            }
            {title &&
            <Text style={styles.text}>{title}</Text>
            }
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 4,
        padding: 6,
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