import {createStackNavigator} from "@react-navigation/stack";
import {PlantsStackRoute} from "./PlantsStackRoute";
import React from "react";
import PlantsOverviewScreen from "./screens/PlantsOverviewScreen";
import PlantEditScreen from "./screens/PlantEditScreen";
import PlantDetailScreen from "./screens/PlantDetailScreen";
import PlantsPrefillScreen from "./screens/PlantsPrefillScreen";

const Stack = createStackNavigator();

export default () => {

    return (
        <Stack.Navigator initialRouteName={PlantsStackRoute.PLANTS_OVERVIEW} screenOptions={{headerShown: false}}>
            <Stack.Screen name={PlantsStackRoute.PLANTS_OVERVIEW} component={PlantsOverviewScreen}/>
            <Stack.Screen name={PlantsStackRoute.PLANTS_DETAIL} component={PlantDetailScreen}/>
            <Stack.Screen name={PlantsStackRoute.PLANTS_EDIT} component={PlantEditScreen}/>
            <Stack.Screen name={PlantsStackRoute.PLANTS_PREFILL} component={PlantsPrefillScreen}/>
        </Stack.Navigator>
    )

}