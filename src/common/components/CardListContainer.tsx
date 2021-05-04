import {View} from "react-native";
import React, {ReactElement} from "react";

type CardListContainerProps = {
    children?: ReactElement | ReactElement[];
    noBottomMargin?: boolean;
}

export default ({children, noBottomMargin}: CardListContainerProps) => {

    const style = {
        margin: -15,
        marginBottom: noBottomMargin ? 0 : -15
    };

    return (
        <View style={style}>
            {children}
        </View>
    )
}