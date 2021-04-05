import {Asset} from "expo-asset";
import * as FileSystem from "expo-file-system";
import ImageDataUriHelper from "../common/ImageDataUriHelper";
import {Plant} from "../model/Plant";
import {WaterDemand} from "../model/WaterDemand";
import {PreferredLocation} from "../model/PreferredLocation";
import {WinterProof} from "../model/WinterProof";

const BALDUR_GARTEN_BASE_URL = "https://www.baldur-garten.ch";

const ATTRIBUTE_TYPES_TO_IGNORE = [
    "Pflanze nicht zum Verzehr geeignet!"
];

class BaldurGartenService {

    searchForProducts(query: string): Promise<BaldurGartenProductSearchResult[]> {
        const params = new URLSearchParams();
        params.append("query", query);
        params.append("format", "json");

        return fetch(`${BALDUR_GARTEN_BASE_URL}/search/suggestProxy.html?${params.toString()}`, {
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
        const response = await fetch(this.createBaldurDetailLink(searchResult.id));
        const rawHtml = await response.text();

        const plantAttributes = this.extractPlantAttributes(rawHtml);
        const avatar = await this.extractAvatar(searchResult, rawHtml);

        return {
            name: searchResult.name,
            baldurArticleId: searchResult.id,
            avatar,
            ...plantAttributes
        } as Plant;
    }

    private extractPlantAttributes(rawHtml: string) {
        let waterDemand = WaterDemand.WATER_DEMAND_UNDEFINED;
        let preferredLocation = PreferredLocation.PREFERRED_LOCATION_UNDEFINED;
        let winterProof = WinterProof.WINTER_PROOF_UNDEFINED;

        const rawAttributeTypes = this.extractValuesOfElementsWithClass(rawHtml, "pds-feature__label")
            .filter(type => ATTRIBUTE_TYPES_TO_IGNORE.indexOf(type) === -1);

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
        } else {
            console.debug(`type count is not equal to value count (${rawAttributeTypes.length} <> ${rawAttributeValues.length})`)
        }

        return {
            waterDemand,
            preferredLocation,
            winterProof
        }
    }

    private async extractAvatar(searchResult: BaldurGartenProductSearchResult, rawHtml: string) {
        const pattern = new RegExp(`alt="${this.escapeRegex(searchResult.name)}" src="([^"]+)"`, 'g');

        const images = Array.from(rawHtml.matchAll(pattern))
            .map((match) => {
                return match[1].trim();
            });

        if (images.length === 0) {
            return undefined;
        }

        const asset = await Asset.fromModule(`${BALDUR_GARTEN_BASE_URL}/${images[0]}`).downloadAsync();
        const avatarAsBase64 = await FileSystem.readAsStringAsync(asset.localUri!, {
            encoding: "base64"
        });

        return ImageDataUriHelper.toImageDataUri(asset.localUri!, avatarAsBase64)
    }

    private escapeRegex(value: string) {
        return value.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    createBaldurDetailLink(articleId: string) {
        return `${BALDUR_GARTEN_BASE_URL}/produkt/${articleId}/detail.html`;
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