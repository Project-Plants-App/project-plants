import {Avatar, AvatarProps, useTheme} from "@ui-kitten/components";
import React from "react";
import {AVATAR_PLACEHOLDER} from "./Images";

type PlantAvatarProps = {
    avatar?: string
} & Omit<AvatarProps, 'source'>;

export default (props: PlantAvatarProps) => {

    const theme = useTheme();

    const source = props.avatar ? {uri: props.avatar} : AVATAR_PLACEHOLDER;

    const style = [props.style, {
        tintColor: undefined,
        backgroundColor: theme['background-basic-color-3']
    }]

    return (
        <Avatar {...props} style={style} source={source}/>
    )
}