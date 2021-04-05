import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import {WaterDemand} from "./model/WaterDemand";
import {PreferredLocation} from "./model/PreferredLocation";
import {PreferredPhLevel} from "./model/PreferredPhLevel";

i18n.translations = {
    de: {
        NAME: 'Name',
        PLANTS: 'Pflanzen',
        ALL_PLANTS: 'Alle Pflanzen',
        SETTINGS: 'Einstellungen',
        NEW: 'Neu',
        SEARCH: 'Suchen',
        // preferred location
        PREFERRED_LOCATION: 'Standort',
        PREFERRED_LOCATION_UNDEFINED: 'Undefiniert',
        PREFERRED_LOCATION_SHADOW: 'Schatten',
        PREFERRED_LOCATION_HALF_SHADOWS: 'Halbschatten',
        PREFERRED_LOCATION_SUNNY: 'Sonnig',
        // preferred PH level
        PREFERRED_PH_LEVEL: 'Gewünschter PH-Wert',
        PREFERRED_PH_LEVEL_UNDEFINED: 'Undefiniert',
        PREFERRED_PH_LEVEL_NO_MATTER: 'Egal',
        PREFERRED_PH_LEVEL_LOW: 'Tief',
        PREFERRED_PH_LEVEL_HIGH: 'Hoch',
        // water demand
        WATER_DEMAND: 'Wasserbedarf',
        WATER_DEMAND_UNDEFINED: 'Undefiniert',
        WATER_DEMAND_LOW: 'Tief',
        WATER_DEMAND_MEDIUM: 'Mittel',
        WATER_DEMAND_HIGH: 'Hoch'
    },
};

i18n.locale = Localization.locale;
i18n.fallbacks = true;
i18n.defaultLocale = 'de'


export const translateWaterDemand = (waterDemand: WaterDemand) => {
    return i18n.t(WaterDemand[waterDemand]);
}

export const translatePreferredLocation = (preferredLocation: PreferredLocation) => {
    return i18n.t(PreferredLocation[preferredLocation]);
}

export const translatePreferredPhLevel = (preferredPhLevel: PreferredPhLevel) => {
    return i18n.t(PreferredPhLevel[preferredPhLevel]);
}

export default i18n;