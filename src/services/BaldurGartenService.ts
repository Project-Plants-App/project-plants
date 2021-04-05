import {Asset} from "expo-asset";
import * as FileSystem from "expo-file-system";
import ImageDataUriHelper from "../common/ImageDataUriHelper";
import {Plant} from "../model/Plant";

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
        const response = await fetch(`https://www.baldur-garten.ch/produkt/${searchResult.id}/detail.html`)
        const rawHtml = await response.text();

        /*
        const htmlDocument: HTMLDocument = new DOMParser().parseFromString(rawHtml, "text/html")
        const rawPlantAttributes = htmlDocument.getElementsByClassName("pds-feature__item");
        for (let i = 0; i < rawPlantAttributes.length; i++) {
            const rawPlantAttribute = rawPlantAttributes.item(i)!;

            const rawAttributeType = rawPlantAttribute.getElementsByClassName("pds-feature__label").item(0);
            if (!rawAttributeType) {
                continue;
            }

            const rawAttributeValue = rawPlantAttribute.getElementsByClassName("pds-feature__content").item(0);
            if (!rawAttributeValue) {
                continue;
            }

            console.debug(`found attribute ${rawAttributeType} with value ${rawAttributeValue}`)
        }
         */

        const asset = await Asset.fromModule(searchResult.avatarUrl).downloadAsync();
        const avatarAsBase64 = await FileSystem.readAsStringAsync(asset.localUri!, {
            encoding: "base64"
        });

        return {
            name: searchResult.name,
            avatar: ImageDataUriHelper.toImageDataUri(asset.localUri!, avatarAsBase64)
        } as Plant;
    }

}

export interface BaldurGartenProductSearchResult {
    id: string;
    name: string;
    avatarUrl: string;
}

export default new BaldurGartenService();