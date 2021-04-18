class ObjectUtils {

    isDefined(value: any) {
        return value !== undefined && value !== null;
    }

    parseDate(dateAsIsoString?: string): Date | undefined {
        try {
            if (this.isDefined(dateAsIsoString)) {
                return new Date(Date.parse(dateAsIsoString!));
            }
        } catch (e) {
            // ignore
        }
        return undefined;
    }

    formatDate(dateAsIsoString?: string): string | undefined {
        try {
            if (this.isDefined(dateAsIsoString)) {
                return new Date(Date.parse(dateAsIsoString!)).toLocaleDateString();
            }
        } catch (e) {
            // ignore
        }
        return undefined;
    }

}

export default new ObjectUtils();