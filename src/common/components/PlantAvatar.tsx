import {Avatar, AvatarProps} from "@ui-kitten/components";
import React from "react";

type PlantAvatarProps = {
    avatar?: string
} & Omit<AvatarProps, 'source'>;

export default (props: PlantAvatarProps) => {

    const source = props.avatar ? {uri: props.avatar} : require('../../../assets/icon.png');
    const style = [props.style, {tintColor: undefined}]

    return (
        <Avatar {...props} style={style} source={source}/>
    )
}