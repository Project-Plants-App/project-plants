import 'isomorphic-fetch';

import BaldurGartenService from "../BaldurGartenService";
import {PreferredLocation} from "../../model/PreferredLocation";
import {WaterDemand} from "../../model/WaterDemand";
import {WinterProof} from "../../model/WinterProof";

describe("BaldurGartenService", () => {
    it('extracts details correctly', async () => {
        const articleId = "4791";

        const result = await BaldurGartenService.extractPlantDetails(articleId);

        expect(result.id).toBeUndefined();
        expect(result.name).toEqual("Säulen-Brombeere Navaho® 'Big&Early'");
        expect(result.avatar).toBeDefined();
        expect(result.baldurArticleId).toEqual(articleId);
        expect(result.preferredLocation).toEqual(PreferredLocation.PREFERRED_LOCATION_SUNNY);
        expect(result.waterDemand).toEqual(WaterDemand.WATER_DEMAND_LOW_TO_MEDIUM);
        expect(result.winterProof).toEqual(WinterProof.WINTER_PROOF_YES);
    });
});