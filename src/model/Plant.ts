import {PreferredPhLevel} from "./PreferredPhLevel";
import {WaterDemand} from "./WaterDemand";
import {PreferredLocation} from "./PreferredLocation";

export interface Plant {

    id?: number;
    name: string,
    waterDemand: WaterDemand;
    preferredLocation: PreferredLocation;
    preferredPhLevel: PreferredPhLevel;

}