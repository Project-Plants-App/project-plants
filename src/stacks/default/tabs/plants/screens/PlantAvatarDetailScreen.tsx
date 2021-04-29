import React, {useState} from "react";
import {useNavigation, useRoute} from "@react-navigation/native";
import {PlantsStackNavigationProp, PlantsStackRouteProp, PlantsStackRoute} from "../PlantsStackRoute";
import {Plant} from "../../../../../model/Plant";
import {Icon, Layout, TopNavigation, TopNavigationAction} from "@ui-kitten/components";
import {Image, StyleSheet} from 'react-native';
import renderTopNavigationTitle from "../../../../../common/components/renderTopNavigationTitle";
import renderBackAction from "../../../../../common/components/renderBackAction";

export default () => {

    const navigation = useNavigation<PlantsStackNavigationProp<PlantsStackRoute.PLANTS_EDIT>>();
    const route = useRoute<PlantsStackRouteProp<PlantsStackRoute.PLANTS_EDIT>>();

    const [plant] = useState(route.params.plant || {} as Plant)

    return (
        <React.Fragment>
            <TopNavigation title={renderTopNavigationTitle(plant.name || '')}
                           alignment="center"
                           accessoryLeft={renderBackAction()}/>
            <Layout style={styles.layout}>
                <Image source={{uri: plant.avatar}} style={styles.avatar}/>
            </Layout>
        </React.Fragment>
    )

}

const styles = StyleSheet.create({
    layout: {
        flex: 1
    },
    avatar: {
        flexGrow: 1
    }
});