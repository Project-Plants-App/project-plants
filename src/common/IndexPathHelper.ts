import {IndexPath} from "@ui-kitten/components";
import ObjectUtils from "./ObjectUtils";

class IndexPathHelper {

    createIndexPath(value?: number, defaultValue?: number) {
        return new IndexPath(ObjectUtils.isDefined(value) ? value! : ObjectUtils.isDefined(defaultValue) ? defaultValue! : 0);
    }

}

export default new IndexPathHelper();