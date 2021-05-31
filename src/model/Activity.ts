import {ActivityType} from "./ActivityType";

export interface Activity {

    id?: number;
    date: string;
    type: ActivityType;
    plants: number[];

}