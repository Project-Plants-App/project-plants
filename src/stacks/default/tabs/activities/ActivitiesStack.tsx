import {createStackNavigator} from "@react-navigation/stack";
import React from "react";
import {ActivitiesStackRoute} from "./ActivitiesStackRoute";
import ActivityPlantSelectionScreen from "./screens/ActivityPlantSelectionScreen";
import ActivityDateSelectionScreen from "./screens/ActivityDateSelectionScreen";
import ActivitiesOverviewScreen from "./screens/ActivitiesOverviewScreen";

const Stack = createStackNavigator();

export default () => {

    return (
        <Stack.Navigator initialRouteName={ActivitiesStackRoute.ACTIVITIES_OVERVIEW} screenOptions={{headerShown: false}}>
            <Stack.Screen name={ActivitiesStackRoute.ACTIVITIES_OVERVIEW}
                          component={ActivitiesOverviewScreen}/>
            <Stack.Screen name={ActivitiesStackRoute.ACTIVITY_DATE_SELECTION}
                          component={ActivityDateSelectionScreen}/>
            <Stack.Screen name={ActivitiesStackRoute.ACTIVITY_PLANT_SELECTION}
                          component={ActivityPlantSelectionScreen}/>
        </Stack.Navigator>
    )

}