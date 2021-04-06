import {WaterDemand} from "./WaterDemand";
import {PreferredLocation} from "./PreferredLocation";
import {WinterProof} from "./WinterProof";

export interface Plant {

    id?: number;
    avatar?: string;
    name: string,
    waterDemand: WaterDemand;
    preferredLocation: PreferredLocation;
    winterProof: WinterProof;
    baldurArticleId: string;
    lastTimeWatered: Date;
    lastTimeFertilised: Date;

}