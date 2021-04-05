import {PreferredPhLevel} from "./PreferredPhLevel";
import {WaterDemand} from "./WaterDemand";
import {PreferredLocation} from "./PreferredLocation";

export interface Plant {

    id?: number;
    avatar?: string;
    name: string,
    waterDemand: WaterDemand;
    preferredLocation: PreferredLocation;
    preferredPhLevel: PreferredPhLevel;

}