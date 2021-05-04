import {View} from "react-native";
import {Text} from "@ui-kitten/components";
import React from "react";

export default (title: string) => {
    return (props: any) => (
        <View {...props}>
            <Text category="s1">{title}</Text>
        </View>
    )
}