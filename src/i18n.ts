import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

i18n.translations = {
    de: {
        NAME: 'Name',
        PLANTS: 'Pflanzen',
        ALL_PLANTS: 'Alle Pflanzen',
        SETTINGS: 'Einstellungen',
        NEW: 'Neu',
        SEARCH: 'Suchen',
        LAST_TIME_WATERED: 'Letztes Mal gegossen',
        LAST_TIME_FERTILISED: 'Letztes Mal gedüngt',
        LAST_TIME_SPRAYED: 'Letztes Mal gespritzt',
        // preferred location
        PREFERRED_LOCATION: 'Standort',
        PREFERRED_LOCATION_UNDEFINED: 'Undefiniert',
        PREFERRED_LOCATION_NO_MATTER: 'Egal',
        PREFERRED_LOCATION_SHADOW: 'Schatten',
        PREFERRED_LOCATION_SHADOW_TO_HALF_SHADOWS: 'Schatten bis Halbschatten',
        PREFERRED_LOCATION_HALF_SHADOWS: 'Halbschatten',
        PREFERRED_LOCATION_HALF_SHADOWS_TO_SUNNY: 'Halbschatten bis Sonnig',
        PREFERRED_LOCATION_SUNNY: 'Sonnig',
        // water demand
        WATER_DEMAND: 'Wasserbedarf',
        WATER_DEMAND_UNDEFINED: 'Undefiniert',
        WATER_DEMAND_LOW: 'gering',
        WATER_DEMAND_LOW_TO_MEDIUM: 'gering bis mittel',
        WATER_DEMAND_MEDIUM: 'mittel',
        WATER_DEMAND_MEDIUM_TO_HIGH: 'mittel bis hoch',
        WATER_DEMAND_HIGH: 'hoch',
        // winter proof
        WINTER_PROOF: 'Winterhart',
        WINTER_PROOF_UNDEFINED: 'Undefiniert',
        WINTER_PROOF_NO: 'Nein',
        WINTER_PROOF_YES: 'Ja'
    },
};

i18n.locale = Localization.locale;
i18n.fallbacks = true;
i18n.defaultLocale = 'de'

export const translateEnumValue = (enumValue: any, enumType: any) => {
    return i18n.t(enumType[enumValue]);
}

export default i18n;