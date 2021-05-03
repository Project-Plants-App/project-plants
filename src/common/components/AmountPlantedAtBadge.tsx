import {Plant} from "../../model/Plant";
import {Text} from "@ui-kitten/components";
import {StyleProp, StyleSheet, ViewStyle} from "react-native";
import React from "react";
import ObjectUtils from "../ObjectUtils";
import Badge from "./Badge";

type AmountPlantedAtBadge = {
    plant: Plant,
    textCategory: string,
    style?: StyleProp<ViewStyle>
}

export default ({plant, textCategory, style}: AmountPlantedAtBadge) => {

    const showAmount = () => {
        return ObjectUtils.isDefined(plant.amount) && plant.amount! > 1;
    }

    const showPlanted = () => {
        return ObjectUtils.isDefined(plant.planted);
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
                <Text category={textCategory}>gepflanzt am {ObjectUtils.formatIsoDateString(plant.planted)!}</Text>
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
