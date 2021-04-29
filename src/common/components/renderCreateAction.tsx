import {Icon, TopNavigationAction} from "@ui-kitten/components";
import React from "react";

export default (callback: () => void) => {
    return () => {
        const SettingsIcon = (props: any) => (
            <Icon {...props} name="plus-outline"/>
        );

        return (
            <TopNavigationAction icon={SettingsIcon} onPress={() => callback()}/>
        );
    }
}

