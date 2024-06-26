import moment from "moment";
import 'moment/locale/de-ch';
import {MomentDateService} from "@ui-kitten/moment";
import {I18n} from "i18n-js";

const i18n = new I18n({
    de: {
        NAME: 'Name',
        BOTANICAL_NAME: 'Botanischer Name',
        PLANTS: 'Pflanzen',
        ALL_PLANTS: 'Alle Pflanzen',
        SETTINGS: 'Einstellungen',
        BACKUPS: 'Sicherungskopien',
        DEVELOPER: 'Entwickler',
        NEW: 'Neu',
        SEARCH: 'Suchen',
        SOURCES: 'Quellen',
        AMOUNT: 'Anzahl',
        PLANTED: 'Gepflanzt',
        TODAY: 'Heute',
        ACTIVITIES: 'Aktivitäten',
        ACTIVITY_TYPE_WATERED: 'gegossen',
        ACTIVITY_TYPE_FERTILISED: 'gedüngt',
        ACTIVITY_TYPE_SPRAYED: 'gespritzt',
        ACTIVITY_TYPE_SWITCH_AUTO_WATERING: 'Automatische Bewässerung aktualisieren',
        LAST_TIME_WATERED: 'Letztes Mal gegossen',
        LAST_TIME_FERTILISED: 'Letztes Mal gedüngt',
        LAST_TIME_SPRAYED: 'Letztes Mal gespritzt',
        AUTOMATICALLY_WATERED: 'Automatische Bewässerung',
        AUTOMATICALLY_WATERED_SHORT: 'Auto. Bewässerung',
        NOTES: 'Notizen',
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
        WINTER_PROOF_YES: 'Ja',
        // detail link name
        BALDUR_GARTEN: 'BALDUR-Garten',
        MEIN_SCHOENER_GARTEN: 'Mein schöner Garten',
        PFLANZEN_FUER_UNSERE_GAERTEN: 'Pflanzen für unsere Gärten'
    }
}, {
    locale: 'de'
})

moment.locale('de-ch');

export const translateEnumValue = (enumValue: any, enumType: any) => {
    return i18n.t(enumType[enumValue]);
}

export const dateService = new MomentDateService('de-ch');

export default i18n;