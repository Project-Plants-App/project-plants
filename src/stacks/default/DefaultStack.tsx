import React from "react";
import PlantsStack from "./tabs/plants/PlantsStack";
import {Drawer, DrawerItem, Icon, IndexPath} from "@ui-kitten/components";
import {PlantsStackRoute} from "./tabs/plants/PlantsStackRoute";
import i18n from "../../i18n";
import {ActivitiesStackRoute} from "./tabs/activities/ActivitiesStackRoute";
import ActivitiesStack from "./tabs/activities/ActivitiesStack";
import {createDrawerNavigator} from "@react-navigation/drawer";
import BackupsStack from "./tabs/backups/BackupsStack";
import {BackupsStackRoute} from "./tabs/backups/BackupsStackRoute";
import {DeveloperStackRoute} from "./tabs/developer/DeveloperStackRoute";
import DeveloperStack from "./tabs/developer/DeveloperStack";

const {Navigator, Screen} = createDrawerNavigator();

export default () => {

    const PlantsIcon = (props: any) => (
        <Icon {...props} name='list-outline'/>
    );

    const ActivitiesIcon = (props: any) => (
        <Icon {...props} name='checkmark-circle-outline'/>
    );

    const BackupsIcon = (props: any) => (
        <Icon {...props} name='save-outline'/>
    );

    const DeveloperIcon = (props: any) => (
        <Icon {...props} name='bulb-outline'/>
    );

    const DrawerContent = ({navigation, state}: any) => (
        <Drawer
            selectedIndex={new IndexPath(state.index)}
            onSelect={index => navigation.navigate(state.routeNames[index.row])}>
            <DrawerItem title={i18n.t('PLANTS')} accessoryLeft={PlantsIcon}/>
            <DrawerItem title={i18n.t('ACTIVITIES')} accessoryLeft={ActivitiesIcon}/>
            <DrawerItem title={i18n.t('BACKUPS')} accessoryLeft={BackupsIcon}/>
            <DrawerItem title={i18n.t('DEVELOPER')} accessoryLeft={DeveloperIcon}/>
        </Drawer>
    );

    return (
        <Navigator drawerContent={props => <DrawerContent {...props}/>} screenOptions={{swipeEnabled: false}}>
            <Screen name={PlantsStackRoute.PLANTS} component={PlantsStack}/>
            <Screen name={ActivitiesStackRoute.ACTIVITIES} component={ActivitiesStack}/>
            <Screen name={BackupsStackRoute.BACKUPS} component={BackupsStack}/>
            <Screen name={DeveloperStackRoute.DEVELOPER} component={DeveloperStack}/>
        </Navigator>
    );

}