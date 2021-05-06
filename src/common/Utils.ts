import {IndexPath} from "@ui-kitten/components";
import moment, {Moment} from "moment";
import i18n from "i18n-js";

export const META_FILES = ['__MACOSX', '.DS_Store'];
export const MIN_DATE = moment(new Date(0));

export function createIndexPath(value?: number, defaultValue?: number) {
    return new IndexPath(isDefined(value) ? value! : isDefined(defaultValue) ? defaultValue! : 0);
}

export function isMetaFile(path: string) {
    for (const metaFile of META_FILES) {
        if (path.endsWith(metaFile)) {
            return true;
        }
    }

    return false;
}

export function bytesToMegaBytes(bytes?: number) {
    if (isDefined(bytes)) {
        return bytes! / 1000000;
    } else {
        return undefined;
    }
}

export function isDefined(value: any) {
    return value !== undefined && value !== null;
}

export function formatAsIsoString(date?: Moment): string | undefined {
    try {
        if (isDefined(date)) {
            return date?.toISOString();
        }
    } catch (e) {
        // ignore
    }
    return undefined;
}

export function parseIsoDateString(dateAsIsoString?: string): Moment | undefined {
    try {
        if (isDefined(dateAsIsoString)) {
            return moment(dateAsIsoString!, moment.ISO_8601);
        }
    } catch (e) {
        // ignore
    }
    return undefined;
}

export function formatTimeString(timeString?: string): string | undefined {
    try {
        if (isDefined(timeString)) {
            let number = parseInt(timeString!);
            if (isNaN(number)) {
                return undefined;
            }

            return moment(number).format('DD.MM.YYYY');
        }
    } catch (e) {
        // ignore
    }
    return undefined;
}

export function formatIsoDateStringAsTimeAgo(dateAsIsoString?: string): string | undefined {
    try {
        if (isDefined(dateAsIsoString)) {
            const date = parseIsoDateString(dateAsIsoString)!;
            const now = moment().startOf('day');
            if (date.isSame(now)) {
                return i18n.t('TODAY');
            }

            return moment.duration(date.diff(now)).humanize(true);
        }
    } catch (e) {
        // ignore
    }
    return undefined;
}

export function formatIsoDateString(dateAsIsoString?: string): string | undefined {
    try {
        if (isDefined(dateAsIsoString)) {
            return parseIsoDateString(dateAsIsoString)?.format('DD.MM.YYYY')
        }
    } catch (e) {
        // ignore
    }
    return undefined;
}

export function enumValues<T>(enumType: any) {
    return Object.keys(enumType)
        .filter(k => typeof (enumType as any)[k as any] === "number")
        .map(k => (enumType as any)[k as any] as T);
}