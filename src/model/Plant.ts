import {WaterDemand} from "./WaterDemand";
import {PreferredLocation} from "./PreferredLocation";
import {WinterProof} from "./WinterProof";

export interface Plant {

    id?: number;
    deleted: boolean;
    avatar?: string;
    name: string,
    botanicalName: string,
    waterDemand: WaterDemand;
    preferredLocation: PreferredLocation;
    winterProof: WinterProof;
    detailLink1: string;
    detailLinkName1: string;
    planted: Date;
    amount: number,
    lastTimeWatered: Date;
    lastTimeFertilised: Date;
    lastTimeSprayed: Date;

}