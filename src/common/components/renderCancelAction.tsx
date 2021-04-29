import {Icon, TopNavigationAction} from "@ui-kitten/components";
import React from "react";
import {StackActions, useNavigation} from "@react-navigation/native";

export default (popToTop?: boolean) => {
    return () => {
        const navigation = useNavigation();

        const cancel = () => {
            if (popToTop) {
                navigation.dispatch(StackActions.popToTop());
            } else {
                navigation.goBack();
            }
        }

        const CancelIcon = (props: any) => (
            <Icon {...props} name="close-outline"/>
        );

        return (
            <TopNavigationAction icon={CancelIcon} onPress={cancel}/>
        );
    }
}

