import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import {BackupsStackRoute} from "./BackupsStackRoute";
import BackupOverviewScreen from "./screens/BackupOverviewScreen";
import BackupDetailScreen from "./screens/BackupDetailScreen";

const Stack = createStackNavigator();

export default () => {

    return (
        <Stack.Navigator initialRouteName={BackupsStackRoute.BACKUPS_OVERVIEW} headerMode="none">
            <Stack.Screen name={BackupsStackRoute.BACKUPS_OVERVIEW} component={BackupOverviewScreen}/>
            <Stack.Screen name={BackupsStackRoute.BACKUPS_DETAIL} component={BackupDetailScreen}/>
        </Stack.Navigator>
    );

}