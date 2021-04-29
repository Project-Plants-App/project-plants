import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import {DeveloperStackRoute} from "./DeveloperStackRoute";
import DeveloperOverviewScreen from "./screens/DeveloperOverviewScreen";

const Stack = createStackNavigator();

export default () => {

    return (
        <Stack.Navigator initialRouteName={DeveloperStackRoute.DEVELOPER_OVERVIEW} headerMode="none">
            <Stack.Screen name={DeveloperStackRoute.DEVELOPER_OVERVIEW} component={DeveloperOverviewScreen}/>
        </Stack.Navigator>
    );

}