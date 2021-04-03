import {useNavigation, useRoute} from "@react-navigation/native";
import {
    Avatar,
    Button,
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
import {PlantsStackNavigationProp, PlantsStackRouteProp, PlantsTabRoute} from "../PlantsTabRoute";
import {Plant} from "../../../../../model/Plant";
import {useOnFocusOnceEffect} from "../../../../../common/hooks/Hooks";
import PlantRepository from "../../../../../repositories/PlantRepository";
import i18n, {translatePreferredLocation, translatePreferredPhLevel, translateWaterDemand} from "../../../../../i18n";

export default () => {

    const navigation = useNavigation<PlantsStackNavigationProp<PlantsTabRoute.PLANTS_OVERVIEW>>();
    const route = useRoute<PlantsStackRouteProp<PlantsTabRoute.PLANTS_OVERVIEW>>();

    const [plants, setPlants] = useState<Plant[]>();

    const reload = () => {
        PlantRepository.selectAllPlants().then((plants) => {
            setPlants(plants);
        });
    }

    useOnFocusOnceEffect(() => {
        reload()
    });

    const openPlantDetail = (plant: Plant) => {
        navigation.navigate({name: PlantsTabRoute.PLANTS_EDIT, params: {plant}});
    }

    const openPlantCreate = () => {
        navigation.navigate({name: PlantsTabRoute.PLANTS_EDIT, params: {}});
    }

    const deletePlant = async (plant: Plant) => {
        await PlantRepository.deletePlant(plant.id!);

        reload()
    }

    const renderItem = ({item}: ListRenderItemInfo<Plant>) => {
        const plantAttributes = [
            {
                label: i18n.t('WATER_DEMAND'),
                value: translateWaterDemand(item.waterDemand)
            },
            {
                label: i18n.t('PREFERRED_LOCATION'),
                value: translatePreferredLocation(item.preferredLocation)
            },
            {
                label: i18n.t('PREFERRED_PH_LEVEL'),
                value: translatePreferredPhLevel(item.preferredPhLevel)
            }
        ];

        const renderPlantAttributes = (entry: ListRenderItemInfo<any>) => (
            <ListItem
                style={styles.plantAttributeListItem}
                title={entry.item.value}
                description={entry.item.label}
                disabled={true}
            />
        );

        const EditIcon = (props: any) => (
            <Icon {...props} name='edit-outline'/>
        );

        const DeleteIcon = (props: any) => (
            <Icon {...props} name='trash-outline'/>
        );

        const CardHeader = (props: any) => (
            <View {...props} style={[props.style, styles.cardHeader]}>
                <Avatar source={item.avatar ? {uri: item.avatar} : require('../../../../../../assets/icon.png')} size="giant"/>
                <Text category='s1' style={styles.cardHeaderTitle}>{item.name}</Text>
            </View>
        );

        const CardFooter = (props: any) => (
            <View {...props} style={[props.style, styles.cardFooter]}>
                <Button accessoryLeft={DeleteIcon} appearance="outline" status="danger"
                        style={styles.deleteButton}
                        onPress={() => deletePlant(item)}/>
                <Button accessoryLeft={EditIcon} appearance="outline"
                        onPress={() => openPlantDetail(item)}/>
            </View>
        );

        return (
            <Card style={styles.card} header={CardHeader} footer={CardFooter} disabled={true}>
                <List data={plantAttributes}
                      renderItem={renderPlantAttributes}
                />
            </Card>
        )
    };

    const SettingsIcon = (props: any) => (
        <Icon {...props} name="plus-outline"/>
    );

    const CreateAction = () => (
        <TopNavigationAction icon={SettingsIcon} onPress={() => openPlantCreate()}/>
    );

    return (
        <React.Fragment>
            <TopNavigation title={i18n.t('ALL_PLANTS')} alignment="center" accessoryRight={CreateAction}/>
            <Divider/>
            <Layout style={styles.layout}>
                <List data={plants} renderItem={renderItem} style={styles.list}/>
            </Layout>
            <Divider/>
        </React.Fragment>
    )
}


const styles = StyleSheet.create({
    layout: {
        flex: 1
    },
    list: {
        flex: 1,
        paddingTop: 15
    },
    plantAttributeListItem: {
        paddingHorizontal: 0
    },
    card: {
        margin: 15,
        marginTop: 0
    },
    deleteButton: {
        marginRight: 15
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center"
    },
    cardHeaderTitle: {
        marginLeft: 10
    },
    cardFooter: {
        flexDirection: "row",
        justifyContent: "flex-end"
    }
});