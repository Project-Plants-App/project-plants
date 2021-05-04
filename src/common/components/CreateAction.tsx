import {TopNavigationAction} from "@ui-kitten/components";
import React from "react";
import {SettingsIcon} from "./Icons";

export default (callback: () => void) => {
    return () => (
        <TopNavigationAction icon={SettingsIcon} onPress={callback}/>
    );
}

