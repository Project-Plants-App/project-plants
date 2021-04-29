import {Icon, TopNavigationAction} from "@ui-kitten/components";
import React from "react";
import {StackActions, useNavigation} from "@react-navigation/native";

export default (popToTop?: boolean) => {
    return () => {
        const navigation = useNavigation();

        const back = () => {
            if (popToTop) {
                navigation.dispatch(StackActions.popToTop());
            } else {
                navigation.goBack();
            }
        }

        const BackIcon = (props: any) => (
            <Icon {...props} name='arrow-back'/>
        );

        return (
            <TopNavigationAction icon={BackIcon} onPress={back}/>
        );
    }
}

