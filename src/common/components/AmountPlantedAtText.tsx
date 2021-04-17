import {Plant} from "../../model/Plant";
import {Text} from "@ui-kitten/components";
import {StyleProp, StyleSheet, View, ViewStyle} from "react-native";
import React from "react";
import ObjectUtils from "../ObjectUtils";

type AmountPlantedAtText = {
    plant: Plant,
    textCategory: string,
    style?: StyleProp<ViewStyle>
}

export default ({plant, textCategory, style}: AmountPlantedAtText) => {

    const showAmount = () => {
        return ObjectUtils.isDefined(plant.amount) && plant.amount > 1;
    }

    const showPlanted = () => {
        return ObjectUtils.isDefined(plant.planted);
    }

    return (
        <View style={[styles.view, style]}>
            {showAmount() &&
            <Text category={textCategory}>{plant.amount} Stück</Text>
            }
            {showAmount() && showPlanted() &&
            <Text category={textCategory}> </Text>
            }
            {showPlanted() &&
            <Text category={textCategory}>gepflanzt am {plant.planted.toLocaleDateString()}</Text>
            }
        </View>
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
