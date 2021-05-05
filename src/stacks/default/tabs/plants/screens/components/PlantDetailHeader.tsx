import React from "react";
import {ImageBackground, ImageBackgroundProps, StyleSheet, useWindowDimensions} from "react-native";
import {Text, useTheme} from "@ui-kitten/components";
import Badge from "../../../../../../common/components/Badge";
import {Plant} from "../../../../../../model/Plant";
import {AVATAR_PLACEHOLDER} from "../../../../../../common/components/Images";
import AmountPlantedAtBadge from "./AmountPlantedAtBadge";

type PlantDetailHeaderProps = {
    plant: Plant
} & Omit<ImageBackgroundProps, 'source'>;

export default (props: PlantDetailHeaderProps) => {

    const theme = useTheme();

    const {width} = useWindowDimensions();

    const source = props.plant.avatar ? {uri: props.plant.avatar} : AVATAR_PLACEHOLDER;
    const style = [props.style, styles.header, {
        tintColor: undefined,
        height: width / 2.5,
        backgroundColor: theme['background-basic-color-2']
    }];

    return (
        <ImageBackground {...props} style={style} source={source} resizeMode={"cover"}>
            <Badge>
                <Text category="h5">{props.plant.name}</Text>
            </Badge>
            <AmountPlantedAtBadge style={{marginTop: 5}} plant={props.plant} textCategory="s2"/>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    header: {
        padding: 15,
        justifyContent: "flex-end",
        alignItems: "flex-start"
    }
});