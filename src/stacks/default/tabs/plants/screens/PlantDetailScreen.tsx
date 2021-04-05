import {
    Card,
    Divider,
    Icon,
    Layout,
    List,
    ListItem,
    Text,
    TopNavigation,
    TopNavigationAction
} from "@ui-kitten/components";
import React, {useState} from "react";
import {ListRenderItemInfo, StyleSheet, View} from "react-native";
import {useNavigation, useRoute} from "@react-navigation/native";
import {PlantsStackNavigationProp, PlantsStackRouteProp, PlantsTabRoute} from "../PlantsTabRoute";
import {Plant} from "../../../../../model/Plant";
import i18n, {translatePreferredLocation, translatePreferredPhLevel, translateWaterDemand} from "../../../../../i18n";
import PlantAvatar from "../../../../../common/components/PlantAvatar";

export default () => {

    const navigation = useNavigation<PlantsStackNavigationProp<PlantsTabRoute.PLANTS_EDIT>>();
    const route = useRoute<PlantsStackRouteProp<PlantsTabRoute.PLANTS_EDIT>>();

    const [plant] = useState(route.params.plant || {} as Plant)

    const back = () => {
        navigation.goBack();
    }

    const edit = async () => {
        navigation.navigate({name: PlantsTabRoute.PLANTS_EDIT, params: {plant}});
    }

    const BackIcon = (props: any) => (
        <Icon {...props} name='arrow-back'/>
    );

    const BackAction = () => (
        <TopNavigationAction icon={BackIcon} onPress={back}/>
    );

    const EditIcon = (props: any) => (
        <Icon {...props} name='edit-outline'/>
    );

    const EditAction = () => (
        <TopNavigationAction icon={EditIcon} onPress={() => edit()}/>
    );

    const plantAttributes = [
        {
            label: i18n.t('WATER_DEMAND'),
            value: translateWaterDemand(plant.waterDemand)
        },
        {
            label: i18n.t('PREFERRED_LOCATION'),
            value: translatePreferredLocation(plant.preferredLocation)
        },
        {
            label: i18n.t('PREFERRED_PH_LEVEL'),
            value: translatePreferredPhLevel(plant.preferredPhLevel)
        }
    ];

    const renderPlantAttributes = (entry: ListRenderItemInfo<any>) => (
        <ListItem
            title={entry.item.value}
            description={entry.item.label}
            disabled={true}
        />
    );

    const CardHeader = (props: any) => (
        <View {...props}>
            <Text category="s1">Allgemeine Informationen</Text>
        </View>
    )

    return (
        <React.Fragment>
            <TopNavigation title={plant.name}
                           alignment="center"
                           accessoryLeft={BackAction}
                           accessoryRight={EditAction}/>
            <Divider/>
            <Layout style={styles.layout} level="2">
                <Card style={styles.card} status="basic" disabled={true}>
                    <PlantAvatar avatar={plant.avatar} size="giant" style={styles.avatar}/>
                    <Text category='s1' style={styles.headerTitle}>{plant.name}</Text>
                </Card>
                <Card style={styles.card} header={CardHeader} status="basic" disabled={true}>
                    <List data={plantAttributes} renderItem={renderPlantAttributes}
                          ItemSeparatorComponent={Divider}/>
                </Card>
            </Layout>
            <Divider/>
        </React.Fragment>
    )

}

const styles = StyleSheet.create({
    layout: {
        flex: 1,
        paddingTop: 15
    },
    avatar: {
        alignSelf: "center",
        marginBottom: 15,
    },
    headerTitle: {
        textAlign: "center"
    },
    card: {
        margin: 15,
        marginTop: 0
    }
});