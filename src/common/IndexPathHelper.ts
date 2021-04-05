import {IndexPath} from "@ui-kitten/components";

class IndexPathHelper {

    createIndexPath(value: number, defaultValue: number) {
        return new IndexPath(value !== undefined ? value : defaultValue)
    }

}

export default new IndexPathHelper();