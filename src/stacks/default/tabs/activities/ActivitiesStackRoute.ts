import {StackNavigationProp} from "@react-navigation/stack";
import {RouteProp} from "@react-navigation/native";
import {ActivityType} from "../../../../model/ActivityType";

export enum ActivitiesStackRoute {
    ACTIVITIES = "activities",
    ACTIVITIES_OVERVIEW = "activities-overview",
    ACTIVITY_DATE_SELECTION = "activity-date-selection",
    ACTIVITY_PLANT_SELECTION = "activity-plant-selection"
}

export type ActivitiesStackRouteParams = {
    "activities-overview": undefined;
    "activity-type-selection": undefined;
    "activity-date-selection": {
        activityType: ActivityType,
    }
    "activity-plant-selection": {
        activityType: ActivityType,
        activityDate: string
    }
}

export type ActivitiesStackRouteProp<RouteName extends keyof ActivitiesStackRouteParams> = RouteProp<ActivitiesStackRouteParams, RouteName>;

export type ActivitiesStackNavigationProp<RouteName extends keyof ActivitiesStackRouteParams> = StackNavigationProp<ActivitiesStackRouteParams, RouteName>;
