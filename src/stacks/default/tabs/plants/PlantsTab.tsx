import {createStackNavigator} from "@react-navigation/stack";
import {PlantsTabRoute} from "./PlantsTabRoute";
import React from "react";
import PlantsOverviewScreen from "./screens/PlantsOverviewScreen";
import PlantEditScreen from "./screens/PlantEditScreen";
import PlantDetailScreen from "./screens/PlantDetailScreen";

const Stack = createStackNavigator();

export default function PlantsTab() {

    return (
        <Stack.Navigator initialRouteName={PlantsTabRoute.PLANTS_OVERVIEW} headerMode="none">
            <Stack.Screen name={PlantsTabRoute.PLANTS_OVERVIEW} component={PlantsOverviewScreen}/>
            <Stack.Screen name={PlantsTabRoute.PLANTS_DETAIL} component={PlantDetailScreen}/>
            <Stack.Screen name={PlantsTabRoute.PLANTS_EDIT} component={PlantEditScreen}/>
        </Stack.Navigator>
    )

}