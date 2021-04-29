import {StackNavigationProp} from "@react-navigation/stack";
import {RouteProp} from "@react-navigation/native";
import {ActivityType} from "../../../../model/ActivityType";

export enum ActivitiesTabRoute {
    ACTIVITIES = "activities",
    ACTIVITY_TYPE_SELECTION = "activity-type-selection",
    ACTIVITY_DATE_SELECTION = "activity-date-selection",
    ACTIVITY_PLANT_SELECTION = "activity-plant-selection"
}

export type ActivitiesStackRouteParams = {
    "activity-type-selection": undefined;
    "activity-date-selection": {
        activityTypes: ActivityType[],
    }
    "activity-plant-selection": {
        activityTypes: ActivityType[],
        activityDate: string
    }
}

export type ActivitiesStackRouteProp<RouteName extends keyof ActivitiesStackRouteParams> = RouteProp<ActivitiesStackRouteParams, RouteName>;

export type ActivitiesStackNavigationProp<RouteName extends keyof ActivitiesStackRouteParams> = StackNavigationProp<ActivitiesStackRouteParams, RouteName>;
