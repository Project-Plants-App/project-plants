import {WaterDemand} from "./WaterDemand";
import {PreferredLocation} from "./PreferredLocation";
import {WinterProof} from "./WinterProof";

export interface Plant {

    id?: number;
    avatar?: string;
    name?: string,
    botanicalName?: string,
    waterDemand?: WaterDemand;
    preferredLocation?: PreferredLocation;
    winterProof?: WinterProof;
    detailLink1?: string;
    detailLinkName1?: string;
    planted?: string;
    amount?: number,
    lastTimeWatered?: string;
    lastTimeFertilised?: string;
    lastTimeSprayed?: string;
    automaticallyWatered?: boolean;

}