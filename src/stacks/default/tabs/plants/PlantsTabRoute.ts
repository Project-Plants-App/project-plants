import {StackNavigationProp} from "@react-navigation/stack";
import {RouteProp} from "@react-navigation/native";
import {Plant} from "../../../../model/Plant";

export enum PlantsTabRoute {
    PLANTS = "plants",
    PLANTS_OVERVIEW = "plants-overview",
    PLANTS_DETAIL = "plants-detail",
    PLANTS_AVATAR_DETAIL = "plants-avatar-detail",
    PLANTS_EDIT = "plants-edit",
    PLANTS_PREFILL = "plants-prefill"
}

export type PlantsStackRouteParams = {
    "plants-overview": undefined;
    "plants-detail": {
        plant: Plant
    },
    "plants-avatar-detail": {
        plant: Plant
    }
    "plants-edit": {
        plant?: Plant
    },
    "plants-prefill": {
        plant?: Plant
    }
}

export type PlantsStackRouteProp<RouteName extends keyof PlantsStackRouteParams> = RouteProp<PlantsStackRouteParams, RouteName>;

export type PlantsStackNavigationProp<RouteName extends keyof PlantsStackRouteParams> = StackNavigationProp<PlantsStackRouteParams, RouteName>;
