import {useNavigation, useRoute} from "@react-navigation/native";
import {
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
import {WaterDemand} from "../../../../../model/WaterDemand";
import {PreferredPhLevel} from "../../../../../model/PreferredPhLevel";
import {PreferredLocation} from "../../../../../model/PreferredLocation";

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
                label: "Wasserbedarf",
                value: WaterDemand[item.waterDemand]
            },
            {
                label: "Standort",
                value: PreferredLocation[item.preferredLocation]
            },
            {
                label: "Gewünschter PH-Wert",
                value: PreferredPhLevel[item.preferredPhLevel]
            }
        ];

        const renderPlantAttributes = (entry: ListRenderItemInfo<any>) => (
            <ListItem
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
            <View {...props}>
                <Text category='s1'>{item.name}</Text>
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
                <List
                    data={plantAttributes}
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
            <TopNavigation title="All Plants" alignment="center" accessoryRight={CreateAction}/>
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
        paddingTop:15

    },
    card: {
        margin: 15,
        marginTop: 0
    },
    deleteButton: {
        marginRight: 15
    },
    cardFooter: {
        flexDirection: "row",
        justifyContent: "flex-end"
    }
});