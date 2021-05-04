import {IndexPath} from "@ui-kitten/components";

export const META_FILES = ['__MACOSX', '.DS_Store'];
export const MIN_DATE = new Date(0);

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

export function parseIsoDateString(dateAsIsoString?: string): Date | undefined {
    try {
        if (isDefined(dateAsIsoString)) {
            return new Date(Date.parse(dateAsIsoString!));
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

            return new Date(number).toLocaleDateString();
        }
    } catch (e) {
        // ignore
    }
    return undefined;
}

export function formatIsoDateString(dateAsIsoString?: string): string | undefined {
    try {
        if (isDefined(dateAsIsoString)) {
            return new Date(Date.parse(dateAsIsoString!)).toLocaleDateString();
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