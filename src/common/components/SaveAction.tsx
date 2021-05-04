import {TopNavigationAction} from "@ui-kitten/components";
import React from "react";
import {SaveIcon} from "./Icons";

export default (callback: () => void) => {
    return () => (
        <TopNavigationAction icon={SaveIcon} onPress={callback}/>
    );
}