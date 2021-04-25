import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import SettingsOverview from "./screens/SettingsOverview";
import {SettingsTabRoute} from "./SettingsTabRoute";
import BackupOverviewScreen from "./screens/BackupOverviewScreen";
import BackupDetailScreen from "./screens/BackupDetailScreen";
import DeveloperScreen from "./screens/DeveloperScreen";

const Stack = createStackNavigator();

export default function SettingsTab() {

    return (
        <Stack.Navigator initialRouteName={SettingsTabRoute.SETTINGS_OVERVIEW} headerMode="none">
            <Stack.Screen name={SettingsTabRoute.SETTINGS_OVERVIEW} component={SettingsOverview}/>
            <Stack.Screen name={SettingsTabRoute.SETTINGS_BACKUP_OVERVIEW} component={BackupOverviewScreen}/>
            <Stack.Screen name={SettingsTabRoute.SETTINGS_BACKUP_DETAIL} component={BackupDetailScreen}/>
            <Stack.Screen name={SettingsTabRoute.SETTINGS_DEVELOPER} component={DeveloperScreen}/>
        </Stack.Navigator>
    );

}