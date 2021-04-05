import {Asset} from "expo-asset";
import * as FileSystem from "expo-file-system";
import ImageDataUriHelper from "../common/ImageDataUriHelper";
import {Plant} from "../model/Plant";
import {WaterDemand} from "../model/WaterDemand";
import {PreferredLocation} from "../model/PreferredLocation";
import {WinterProof} from "../model/WinterProof";

class BaldurGartenService {

    searchForProducts(query: string): Promise<BaldurGartenProductSearchResult[]> {
        const params = new URLSearchParams();
        params.append("query", query);
        params.append("format", "json");

        return fetch(`https://www.baldur-garten.ch/search/suggestProxy.html?${params.toString()}`, {
            headers: {
                "Accept": "application/json"
            }
        }).then((response) => {
            return response.json()
        }).then((searchResults: { suggestions: any[] }) => {
            return searchResults
                .suggestions
                .filter((searchResult) => {
                    return searchResult.type === "productName";
                });
        }).then((searchResults: any[]) => {
            return searchResults
                .map((searchResult) => {
                    return {
                        id: searchResult.attributes.articleNr,
                        name: searchResult.name,
                        avatarUrl: searchResult.image
                    }
                })
        });
    }

    async extractPlantDetails(searchResult: BaldurGartenProductSearchResult) {
        let waterDemand = WaterDemand.WATER_DEMAND_UNDEFINED;
        let preferredLocation = PreferredLocation.PREFERRED_LOCATION_UNDEFINED;
        let winterProof = WinterProof.WINTER_PROOF_UNDEFINED;

        const response = await fetch(this.createBaldurDetailLink(searchResult.id))
        const rawHtml = await response.text();

        const rawAttributeTypes = this.extractValuesOfElementsWithClass(rawHtml, "pds-feature__label");
        const rawAttributeValues = this.extractValuesOfElementsWithClass(rawHtml, "pds-feature__content");

        if (rawAttributeTypes.length === rawAttributeValues.length) {
            for (let i = 0; i < rawAttributeTypes.length; i++) {
                const rawAttributeType = rawAttributeTypes[i].toLowerCase();
                const rawAttributeValue = rawAttributeValues[i].toLowerCase();

                console.debug(`found attribute ${rawAttributeType} with value ${rawAttributeValue}`)
                switch (rawAttributeType) {
                    case "standort": {
                        switch (rawAttributeValue) {
                            case "sonne": {
                                preferredLocation = PreferredLocation.PREFERRED_LOCATION_SUNNY;
                                break;
                            }
                            case "sonne bis halbschatten": {
                                preferredLocation = PreferredLocation.PREFERRED_LOCATION_HALF_SHADOWS_TO_SUNNY;
                                break;
                            }
                            case "halbschatten": {
                                preferredLocation = PreferredLocation.PREFERRED_LOCATION_HALF_SHADOWS;
                                break;
                            }
                            case "halbschatten bis schatten": {
                                preferredLocation = PreferredLocation.PREFERRED_LOCATION_SHADOW_TO_HALF_SHADOWS;
                                break;
                            }
                            case "schatten": {
                                preferredLocation = PreferredLocation.PREFERRED_LOCATION_SHADOW;
                                break;
                            }
                            case "sonne bis schatten" : {
                                preferredLocation = PreferredLocation.PREFERRED_LOCATION_NO_MATTER;
                                break;
                            }
                            default: {
                                console.debug(`unknown value ${rawAttributeValue} for PreferredLocation`)
                            }
                        }
                        break;
                    }
                    case "wasserbedarf" : {
                        switch (rawAttributeValue) {
                            case "gering": {
                                waterDemand = WaterDemand.WATER_DEMAND_LOW;
                                break;
                            }
                            case "gering - mittel": {
                                waterDemand = WaterDemand.WATER_DEMAND_LOW_TO_MEDIUM;
                                break;
                            }
                            case "mittel": {
                                waterDemand = WaterDemand.WATER_DEMAND_MEDIUM;
                                break;
                            }
                            case "mittel - hoch": {
                                waterDemand = WaterDemand.WATER_DEMAND_MEDIUM_TO_HIGH;
                                break;
                            }
                            case "hoch": {
                                waterDemand = WaterDemand.WATER_DEMAND_HIGH;
                                break;
                            }
                            default: {
                                console.debug(`unknown value ${rawAttributeValue} for PreferredLocation`)
                            }
                        }
                        break;
                    }
                    case "winterhart" : {
                        switch (rawAttributeValue) {
                            case "ja": {
                                winterProof = WinterProof.WINTER_PROOF_YES
                                break;
                            }
                            case "nein": {
                                winterProof = WinterProof.WINTER_PROOF_NO
                                break;
                            }
                            default: {
                                console.debug(`unknown value ${rawAttributeValue} for WinterProof`)
                            }
                        }
                        break;
                    }
                }
            }
        }

        const asset = await Asset.fromModule(searchResult.avatarUrl).downloadAsync();
        const avatarAsBase64 = await FileSystem.readAsStringAsync(asset.localUri!, {
            encoding: "base64"
        });

        return {
            name: searchResult.name,
            baldurArticleId: searchResult.id,
            avatar: ImageDataUriHelper.toImageDataUri(asset.localUri!, avatarAsBase64),
            waterDemand,
            preferredLocation,
            winterProof,
        } as Plant;
    }

    createBaldurDetailLink(articleId: string) {
        return `https://www.baldur-garten.ch/produkt/${articleId}/detail.html`;
    }

    private extractValuesOfElementsWithClass(rawHtml: string, cssClass: string): string[] {
        const pattern = new RegExp(`${cssClass}[^>]+>([^<]+)<`, 'gm');

        return Array.from(rawHtml.matchAll(pattern))
            .map((match) => {
                return match[1].trim();
            });
    }

}

export interface BaldurGartenProductSearchResult {
    id: string;
    name: string;
    avatarUrl: string;
}

export default new BaldurGartenService();