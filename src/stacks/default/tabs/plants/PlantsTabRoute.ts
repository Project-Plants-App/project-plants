import {StackNavigationProp} from "@react-navigation/stack";
import {RouteProp} from "@react-navigation/native";
import {Plant} from "../../../../model/Plant";

export enum PlantsTabRoute {
    PLANTS = "plants",
    PLANTS_OVERVIEW = "plants-overview",
    PLANTS_DETAIL = "plants-detail",
    PLANTS_EDIT = "plants-edit"
}

export type PlantsStackRouteParams = {
    "plants-overview": undefined;
    "plants-detail": {
        plant: Plant
    }
    "plants-edit": {
        plant?: Plant
    }
}

export type PlantsStackRouteProp<RouteName extends keyof PlantsStackRouteParams> = RouteProp<PlantsStackRouteParams, RouteName>;

export type PlantsStackNavigationProp<RouteName extends keyof PlantsStackRouteParams> = StackNavigationProp<PlantsStackRouteParams, RouteName>;
