import {TopNavigationAction} from "@ui-kitten/components";
import {EditIcon} from "./Icons";
import React from "react";

export default (callback: () => void) => {
    return () => (
        <TopNavigationAction icon={EditIcon} onPress={callback}/>
    )
};