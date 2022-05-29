import React from "react";
import {Image} from 'react-native';

const AssetIconProvider = (source: any) => ({
    toReactElement: ({animation, ...props}: any) => (
        <Image {...props} source={source}/>
    ),
});

export const AssetIconsPack = {
    name: 'assets',
    icons: {
        'droplet-automatic-outline': AssetIconProvider(require('../../assets/icons/droplet-automatic-outline.png')),
    },
};