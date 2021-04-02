import SettingsTab from "./tabs/settings/SettingsTab";
import React from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import PlantsTab from "./tabs/plants/PlantsTab";
import {BottomNavigation, BottomNavigationTab, Icon} from "@ui-kitten/components";
import {PlantsTabRoute} from "./tabs/plants/PlantsTabRoute";
import {SettingsTabRoute} from "./tabs/settings/SettingsTabRoute";
import i18n from "../../i18n";

const {Navigator, Screen} = createBottomTabNavigator();

export default () => {

    const PlantsIcon = (props: any) => (
        <Icon {...props} name='list-outline'/>
    );

    const SettingsIcon = (props: any) => (
        <Icon {...props} name='settings-outline'/>
    );

    const BottomTabBar = ({navigation, state}: any) => (
        <BottomNavigation
            selectedIndex={state.index}
            onSelect={index => navigation.navigate(state.routeNames[index])}>
            <BottomNavigationTab title={i18n.t('PLANTS')} icon={PlantsIcon}/>
            <BottomNavigationTab title={i18n.t('SETTINGS')} icon={SettingsIcon}/>
        </BottomNavigation>
    );

    return (
        <Navigator tabBar={props => <BottomTabBar {...props} />}>
            <Screen name={PlantsTabRoute.PLANTS} component={PlantsTab}/>
            <Screen name={SettingsTabRoute.SETTINGS} component={SettingsTab}/>
        </Navigator>
    );

}