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
import {Linking, ListRenderItemInfo, ScrollView, StyleSheet, TouchableOpacity, View} from "react-native";
import {StackActions, useNavigation, useRoute} from "@react-navigation/native";
import {PlantsStackNavigationProp, PlantsStackRouteProp, PlantsTabRoute} from "../PlantsTabRoute";
import {Plant} from "../../../../../model/Plant";
import i18n, {translateEnumValue} from "../../../../../i18n";
import PlantAvatar from "../../../../../common/components/PlantAvatar";
import {WaterDemand} from "../../../../../model/WaterDemand";
import {PreferredLocation} from "../../../../../model/PreferredLocation";
import {WinterProof} from "../../../../../model/WinterProof";
import BaldurGartenService from "../../../../../services/BaldurGartenService";
import PlantRepository from "../../../../../repositories/PlantRepository";

export default () => {

    const navigation = useNavigation<PlantsStackNavigationProp<PlantsTabRoute.PLANTS_EDIT>>();
    const route = useRoute<PlantsStackRouteProp<PlantsTabRoute.PLANTS_EDIT>>();

    const [plant, setPlant] = useState(route.params.plant || {} as Plant)

    const back = () => {
        navigation.dispatch(StackActions.popToTop());
    }

    const edit = async () => {
        navigation.navigate({name: PlantsTabRoute.PLANTS_EDIT, params: {plant}});
    }

    const openAvatarDetail = () => {
        navigation.navigate({name: PlantsTabRoute.PLANTS_AVATAR_DETAIL, params: {plant}});
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

    const LinkIcon = (props: any) => (
        <Icon {...props} name="external-link-outline"/>
    );

    const plantAttributes = [
        {
            label: i18n.t('WATER_DEMAND'),
            value: translateEnumValue(plant.waterDemand, WaterDemand)
        },
        {
            label: i18n.t('PREFERRED_LOCATION'),
            value: translateEnumValue(plant.preferredLocation, PreferredLocation)
        },
        {
            label: i18n.t('WINTER_PROOF'),
            value: translateEnumValue(plant.winterProof, WinterProof)
        }
    ];

    const renderPlantAttributes = (entry: ListRenderItemInfo<any>) => (
        <ListItem title={entry.item.value} description={entry.item.label} disabled={true}/>
    );

    const formatDate = (date: Date) => {
        return date ? date.toLocaleDateString() : '';
    }

    const updatePlant = async () => {
        await PlantRepository.insertOrUpdatePlant(plant);
        setPlant({...plant});
    }

    const plantActivities = [
        {
            label: i18n.t('LAST_TIME_WATERED'),
            value: formatDate(plant.lastTimeWatered),
            onPress: async () => {
                plant.lastTimeWatered = new Date();
                await updatePlant();
            }
        },
        {
            label: i18n.t('LAST_TIME_FERTILISED'),
            value: formatDate(plant.lastTimeFertilised),
            onPress: async () => {
                plant.lastTimeFertilised = new Date();
                await updatePlant();
            }
        }
    ];

    const renderActivities = (entry: ListRenderItemInfo<any>) => {
        const icon = (props: any) => (
            <Icon {...props} name="refresh-outline"/>
        );

        const button = (props: any) => (
            <Button {...props} accessoryRight={icon} appearance="ghost" onPress={entry.item.onPress}/>
        );

        return (
            <ListItem title={entry.item.value} description={entry.item.label} accessoryRight={button} disabled={true}/>
        );
    };

    const CardHeader = (title: string) => {
        return (props: any) => (
            <View {...props}>
                <Text category="s1">{title}</Text>
            </View>
        )
    }

    return (
        <React.Fragment>
            <TopNavigation title={plant.name}
                           alignment="center"
                           accessoryLeft={BackAction}
                           accessoryRight={EditAction}/>
            <Divider/>
            <Layout style={styles.layout} level="2">
                <ScrollView>
                    <View style={styles.contentContainer}>
                        <Card style={styles.card} status="basic" disabled={true}>
                            <TouchableOpacity onPress={() => openAvatarDetail()} style={styles.avatarContainer}>
                                <PlantAvatar avatar={plant.avatar} size="giant"/>
                            </TouchableOpacity>

                            <Text category='s1' style={styles.headerTitle}>{plant.name}</Text>
                        </Card>
                        <Card style={styles.card} header={CardHeader("Allgemeine Informationen")} status="basic"
                              disabled={true}>
                            <List data={plantAttributes} renderItem={renderPlantAttributes}
                                  ItemSeparatorComponent={Divider}/>

                            {plant.baldurArticleId &&
                            <Button accessoryLeft={LinkIcon}
                                    appearance="outline"
                                    style={styles.button}
                                    onPress={() => Linking.openURL(BaldurGartenService.createBaldurDetailLink(plant.baldurArticleId))}>
                                BALDUR-Garten
                            </Button>
                            }
                        </Card>
                        <Card style={styles.card} header={CardHeader("Aktivitäten")} status="basic" disabled={true}>
                            <List data={plantActivities} renderItem={renderActivities}
                                  ItemSeparatorComponent={Divider}/>
                        </Card>
                    </View>
                </ScrollView>
            </Layout>
            <Divider/>
        </React.Fragment>
    )

}

const styles = StyleSheet.create({
    layout: {
        flex: 1
    },
    contentContainer: {
        margin: 15,
        marginBottom: 0
    },
    avatarContainer: {
        alignSelf: "center",
        marginBottom: 15,
    },
    headerTitle: {
        textAlign: "center"
    },
    card: {
        marginBottom: 15
    },
    button: {
        marginTop: 15
    }
});