class ObjectUtils {

    isDefined(value: any) {
        return value !== undefined && value !== null;
    }

    parseIsoDateString(dateAsIsoString?: string): Date | undefined {
        try {
            if (this.isDefined(dateAsIsoString)) {
                return new Date(Date.parse(dateAsIsoString!));
            }
        } catch (e) {
            // ignore
        }
        return undefined;
    }

    formatTimeString(timeString?: string): string | undefined {
        try {
            if (this.isDefined(timeString)) {
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

    formatIsoDateString(dateAsIsoString?: string): string | undefined {
        try {
            if (this.isDefined(dateAsIsoString)) {
                return new Date(Date.parse(dateAsIsoString!)).toLocaleDateString();
            }
        } catch (e) {
            // ignore
        }
        return undefined;
    }

    wait(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

}

export default new ObjectUtils();