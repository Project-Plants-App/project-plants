import {Icon, TopNavigationAction} from "@ui-kitten/components";
import React from "react";
import {useNavigation} from "@react-navigation/native";
import {DrawerNavigationProp} from "@react-navigation/drawer";

export default () => {

    const navigation = useNavigation<DrawerNavigationProp<any>>();

    const DrawerIcon = (props: any) => (
        <Icon {...props} name="menu-outline"/>
    );

    return (
        <TopNavigationAction icon={DrawerIcon} onPress={() => navigation.openDrawer()}/>
    );

}