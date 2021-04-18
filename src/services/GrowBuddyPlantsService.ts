import {Plant} from "../model/Plant";
import {WinterProof} from "../model/WinterProof";
import {WaterDemand} from "../model/WaterDemand";
import {PreferredLocation} from "../model/PreferredLocation";
import ObjectUtils from "../common/ObjectUtils";

const GROW_BUDDY_PLANT_API_BASE_URL = "http://jonasbamberger.synology.me:9090";

class GrowBuddyPlantsService {

    searchForProducts(query: string, sources: PlantInfoSource[]): Promise<Plant[]> {
        const params = new URLSearchParams();
        params.append("query", query);
        sources.forEach((source) => {
            params.append("sources", source);
        });

        return fetch(`${GROW_BUDDY_PLANT_API_BASE_URL}/api/plant-infos?${params.toString()}`)
            .then((response) => (response.json()))
            .then((searchResults: PlantInfo[]) => (
                searchResults.map(searchResult => ({
                    name: searchResult.name,
                    botanicalName: searchResult.botanicalName,
                    detailLink1: searchResult.detailLink,
                    detailLinkName1: searchResult.source as string,
                    waterDemand: this.mapWaterDemand(searchResult),
                    preferredLocation: this.mapPreferredLocation(searchResult),
                    winterProof: this.mapWinterProof(searchResult)
                } as Plant))
            ));
    }

    private mapWaterDemand(searchResult: PlantInfo) {
        if (!ObjectUtils.isDefined(searchResult.waterDemand)) {
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
        if (!ObjectUtils.isDefined(searchResult.preferredLocation)) {
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
        if (!ObjectUtils.isDefined(searchResult.winterProof)) {
            return WinterProof.WINTER_PROOF_UNDEFINED;
        }

        return searchResult.winterProof ? WinterProof.WINTER_PROOF_YES : WinterProof.WINTER_PROOF_NO;
    }

}

interface PlantInfo {
    name: string;
    botanicalName?: string;
    detailLink: string;
    source: PlantInfoSource;
    waterDemand?: PlantInfoWaterDemand;
    preferredLocation?: PlantInfoPreferredLocation;
    winterProof?: boolean;
}

export enum PlantInfoSource {
    BALDUR_GARTEN = "BALDUR_GARTEN",
    MEIN_SCHOENER_GARTEN = "MEIN_SCHOENER_GARTEN",
    PFLANZEN_FUER_UNSERE_GAERTEN = "PFLANZEN_FUER_UNSERE_GAERTEN"
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