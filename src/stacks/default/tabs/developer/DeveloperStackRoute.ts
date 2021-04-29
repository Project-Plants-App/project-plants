import {RouteProp} from "@react-navigation/native";
import {StackNavigationProp} from "@react-navigation/stack";

export enum DeveloperStackRoute {
    DEVELOPER = 'developer',
    DEVELOPER_OVERVIEW = 'developer-overview'
}

export type DeveloperStackRouteParams = {
    "developer-overview": any;
}

export type DeveloperStackRouteProp<RouteName extends keyof DeveloperStackRouteParams> = RouteProp<DeveloperStackRouteParams, RouteName>;

export type DeveloperStackNavigationProp<RouteName extends keyof DeveloperStackRouteParams> = StackNavigationProp<DeveloperStackRouteParams, RouteName>;
