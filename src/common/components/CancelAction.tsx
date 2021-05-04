import {TopNavigationAction} from "@ui-kitten/components";
import React from "react";
import {StackActions, useNavigation} from "@react-navigation/native";
import {CancelIcon} from "./Icons";

export default (popToTop?: boolean) => {
    return () => {
        const navigation = useNavigation();

        function cancel() {
            if (popToTop) {
                navigation.dispatch(StackActions.popToTop());
            } else {
                navigation.goBack();
            }
        }

        return (
            <TopNavigationAction icon={CancelIcon} onPress={() => cancel()}/>
        );
    }
}

