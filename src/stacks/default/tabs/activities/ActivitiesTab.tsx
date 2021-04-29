import {createStackNavigator} from "@react-navigation/stack";
import React from "react";
import {ActivitiesTabRoute} from "./ActivitiesTabRoute";
import ActivityTypeSelectionScreen from "./screens/ActivityTypeSelectionScreen";
import ActivityPlantSelectionScreen from "./screens/ActivityPlantSelectionScreen";
import ActivityDateSelectionScreen from "./screens/ActivityDateSelectionScreen";

const Stack = createStackNavigator();

export default () => {

    return (
        <Stack.Navigator initialRouteName={ActivitiesTabRoute.ACTIVITY_TYPE_SELECTION} headerMode="none">
            <Stack.Screen name={ActivitiesTabRoute.ACTIVITY_TYPE_SELECTION} component={ActivityTypeSelectionScreen}/>
            <Stack.Screen name={ActivitiesTabRoute.ACTIVITY_DATE_SELECTION} component={ActivityDateSelectionScreen}/>
            <Stack.Screen name={ActivitiesTabRoute.ACTIVITY_PLANT_SELECTION} component={ActivityPlantSelectionScreen}/>
        </Stack.Navigator>
    )

}