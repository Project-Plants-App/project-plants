import {Text} from "@ui-kitten/components";
import {StyleProp, StyleSheet, ViewStyle} from "react-native";
import React from "react";
import {formatIsoDateString, isDefined} from "../../../../../../common/Utils";
import {Plant} from "../../../../../../model/Plant";
import Badge from "../../../../../../common/components/Badge";

type AmountPlantedAtBadge = {
    plant: Plant,
    textCategory: string,
    style?: StyleProp<ViewStyle>
}

export default ({plant, textCategory, style}: AmountPlantedAtBadge) => {

    function showAmount() {
        return isDefined(plant.amount) && plant.amount! > 1;
    }

    function showPlanted() {
        return isDefined(plant.planted);
    }

    if (!showAmount() && !showPlanted()) {
        return <></>
    }

    return (
        <Badge style={[styles.view, style]}>
            <React.Fragment>
                {showAmount() &&
                <Text category={textCategory}>{plant.amount!} Stück</Text>
                }
                {showAmount() && showPlanted() &&
                <Text category={textCategory}> </Text>
                }
                {showPlanted() &&
                <Text category={textCategory}>gepflanzt am {formatIsoDateString(plant.planted)!}</Text>
                }
            </React.Fragment>
        </Badge>
    )

}

const styles = StyleSheet.create({
    view: {
        flexDirection: "row",
        justifyContent: "center"
    },
    icon: {
        width: 12,
        height: 12,
        marginRight: 3
    },
    text: {

        fontSize: 12
    }
})
