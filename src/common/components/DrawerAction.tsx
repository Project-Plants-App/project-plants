import {TopNavigationAction} from "@ui-kitten/components";
import React from "react";
import {useNavigation} from "@react-navigation/native";
import {DrawerNavigationProp} from "@react-navigation/drawer";
import {DrawerIcon} from "./Icons";

export default () => {

    const navigation = useNavigation<DrawerNavigationProp<any>>();

    return (
        <TopNavigationAction icon={DrawerIcon} onPress={() => navigation.openDrawer()}/>
    );

}