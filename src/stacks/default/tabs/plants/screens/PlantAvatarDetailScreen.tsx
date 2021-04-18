import React, {useState} from "react";
import {useNavigation, useRoute} from "@react-navigation/native";
import {PlantsStackNavigationProp, PlantsStackRouteProp, PlantsTabRoute} from "../PlantsTabRoute";
import {Plant} from "../../../../../model/Plant";
import {Icon, Layout, TopNavigation, TopNavigationAction} from "@ui-kitten/components";
import {Image, StyleSheet} from 'react-native';
import renderTopNavigationTitle from "../../../../../common/components/renderTopNavigationTitle";

export default () => {

    const navigation = useNavigation<PlantsStackNavigationProp<PlantsTabRoute.PLANTS_EDIT>>();
    const route = useRoute<PlantsStackRouteProp<PlantsTabRoute.PLANTS_EDIT>>();

    const [plant] = useState(route.params.plant || {} as Plant)

    const back = () => {
        navigation.goBack();
    }

    const BackIcon = (props: any) => (
        <Icon {...props} name='arrow-back'/>
    );

    const BackAction = () => (
        <TopNavigationAction icon={BackIcon} onPress={back}/>
    );

    return (
        <React.Fragment>
            <TopNavigation title={renderTopNavigationTitle(plant.name || '')}
                           alignment="center"
                           accessoryLeft={BackAction}/>
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