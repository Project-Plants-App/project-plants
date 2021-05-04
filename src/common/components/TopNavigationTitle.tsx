import {TextProps} from "@ui-kitten/components/ui/text/text.component";
import {Text} from "@ui-kitten/components";
import React from "react";
import {StyleSheet} from "react-native";

export default (title: string) => {
    return (props?: TextProps) => {
        return (
            <Text {...props}
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  style={[props?.style, styles.text]}>
                {title}
            </Text>
        )
    }
}

const styles = StyleSheet.create({
    text: {
        marginHorizontal: 50
    }
});