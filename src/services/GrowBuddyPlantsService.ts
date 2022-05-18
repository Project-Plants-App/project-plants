import {Plant} from "../model/Plant";
import {WinterProof} from "../model/WinterProof";
import {WaterDemand} from "../model/WaterDemand";
import {PreferredLocation} from "../model/PreferredLocation";
import {isDefined} from "../common/Utils";
import * as FileSystem from "expo-file-system";
import Fuse from 'fuse.js'
import * as Network from 'expo-network';
import FuseResult = Fuse.FuseResult;

const REMOTE_GROW_BUDDY_PLANTS_URI = "https://raw.githubusercontent.com/Project-Plants-App/project-plants-database/main/database.json";
const LOCAL_GROW_BUDDY_PLANTS_URI = `${FileSystem.documentDirectory}/plants-reference-database.json`;

class GrowBuddyPlantsService {

    private referenceDatabase: PlantInfo[] = [];

    constructor() {
        this.updateAndLoadDatabase();
    }

    async updateAndLoadDatabase() {
        const networkState = await Network.getNetworkStateAsync();
        if (networkState.isInternetReachable) {
            await FileSystem.downloadAsync(REMOTE_GROW_BUDDY_PLANTS_URI, LOCAL_GROW_BUDDY_PLANTS_URI, {cache: false});
        }

        const databaseFileInfo = await FileSystem.getInfoAsync(LOCAL_GROW_BUDDY_PLANTS_URI);
        if (databaseFileInfo.exists) {
            const rawReferenceDatabase = await FileSystem.readAsStringAsync(LOCAL_GROW_BUDDY_PLANTS_URI);
            this.referenceDatabase = JSON.parse(rawReferenceDatabase);
        }
    }

    getDatabaseSize() {
        return this.referenceDatabase.length;
    }

    async search(query: string):
        Promise<Plant[]> {
        const fuse = new Fuse(this.referenceDatabase!, {keys: ['name', 'botanicalName']})
        const result = fuse.search(query)

        return result.slice(0, 20).map(({item}: FuseResult<PlantInfo>) => {
            const plant = {
                name: item.name,
                botanicalName: item.botanicalName,
                detailLink1: item.detailLink,
                detailLinkName1: item.source as string,
                waterDemand: this.mapWaterDemand(item),
                preferredLocation: this.mapPreferredLocation(item),
                winterProof: this.mapWinterProof(item)
            } as any;

            // remove undefined properties
            Object.keys(plant).forEach(key => !isDefined(plant[key]) && delete plant[key])

            return plant as Plant;
        });
    }

    private mapWaterDemand(searchResult: PlantInfo) {
        if (!isDefined(searchResult.waterDemand)) {
            return WaterDemand.WATER_DEMAND_UNDEFINED;
        }

        switch (searchResult.waterDemand) {
            case PlantInfoWaterDemand.LOW:
                return WaterDemand.WATER_DEMAND_LOW;
            case PlantInfoWaterDemand.LOW_TO_MEDIUM:
                return WaterDemand.WATER_DEMAND_LOW_TO_MEDIUM;
            case PlantInfoWaterDemand.MEDIUM:
                return WaterDemand.WATER_DEMAND_MEDIUM;
            case PlantInfoWaterDemand.MEDIUM_TO_HIGH:
                return WaterDemand.WATER_DEMAND_MEDIUM_TO_HIGH;
            case PlantInfoWaterDemand.HIGH:
                return WaterDemand.WATER_DEMAND_HIGH;
        }

        return WaterDemand.WATER_DEMAND_UNDEFINED;
    }

    private mapPreferredLocation(searchResult: PlantInfo) {
        if (!isDefined(searchResult.preferredLocation)) {
            return PreferredLocation.PREFERRED_LOCATION_UNDEFINED;
        }

        switch (searchResult.preferredLocation) {
            case PlantInfoPreferredLocation.NO_MATTER:
                return PreferredLocation.PREFERRED_LOCATION_NO_MATTER;
            case PlantInfoPreferredLocation.SHADOW:
                return PreferredLocation.PREFERRED_LOCATION_SHADOW;
            case PlantInfoPreferredLocation.SHADOW_TO_HALF_SHADOWS:
                return PreferredLocation.PREFERRED_LOCATION_SHADOW_TO_HALF_SHADOWS;
            case PlantInfoPreferredLocation.HALF_SHADOWS:
                return PreferredLocation.PREFERRED_LOCATION_HALF_SHADOWS;
            case PlantInfoPreferredLocation.HALF_SHADOWS_TO_SUNNY:
                return PreferredLocation.PREFERRED_LOCATION_HALF_SHADOWS_TO_SUNNY;
            case PlantInfoPreferredLocation.SUNNY:
                return PreferredLocation.PREFERRED_LOCATION_SUNNY;
        }

        return PreferredLocation.PREFERRED_LOCATION_UNDEFINED;
    }

    private mapWinterProof(searchResult: PlantInfo) {
        if (!isDefined(searchResult.isWinterProof)) {
            return WinterProof.WINTER_PROOF_UNDEFINED;
        }

        return searchResult.isWinterProof ? WinterProof.WINTER_PROOF_YES : WinterProof.WINTER_PROOF_NO;
    }

}

interface PlantInfo {
    name: string;
    botanicalName?: string;
    detailLink: string;
    source: string;
    waterDemand?: PlantInfoWaterDemand;
    preferredLocation?: PlantInfoPreferredLocation;
    isWinterProof?: boolean;
}

enum PlantInfoWaterDemand {
    LOW = "LOW",
    LOW_TO_MEDIUM = "LOW_TO_MEDIUM",
    MEDIUM = "MEDIUM",
    MEDIUM_TO_HIGH = "MEDIUM_TO_HIGH",
    HIGH = "HIGH"
}

enum PlantInfoPreferredLocation {
    NO_MATTER = "NO_MATTER",
    SHADOW = "SHADOW",
    SHADOW_TO_HALF_SHADOWS = "SHADOW_TO_HALF_SHADOWS",
    HALF_SHADOWS = "HALF_SHADOWS",
    HALF_SHADOWS_TO_SUNNY = "HALF_SHADOWS_TO_SUNNY",
    SUNNY = "SUNNY"
}

export default new GrowBuddyPlantsService();