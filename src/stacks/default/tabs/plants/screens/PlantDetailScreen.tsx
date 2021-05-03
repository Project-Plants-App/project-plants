import {
    Button,
    Calendar,
    Card,
    Divider,
    Icon,
    Layout,
    List,
    ListItem,
    Modal,
    Text,
    TopNavigation,
    TopNavigationAction
} from "@ui-kitten/components";
import React, {useState} from "react";
import {Linking, ListRenderItemInfo, ScrollView, StyleSheet, View} from "react-native";
import {useNavigation, useRoute} from "@react-navigation/native";
import {PlantsStackNavigationProp, PlantsStackRoute, PlantsStackRouteProp} from "../PlantsStackRoute";
import {Plant} from "../../../../../model/Plant";
import i18n, {translateEnumValue} from "../../../../../i18n";
import {WaterDemand} from "../../../../../model/WaterDemand";
import {PreferredLocation} from "../../../../../model/PreferredLocation";
import {WinterProof} from "../../../../../model/WinterProof";
import CardListContainer from "../../../../../common/components/CardListContainer";
import renderTopNavigationTitle from "../../../../../common/components/renderTopNavigationTitle";
import AmountPlantedAtBadge from "../../../../../common/components/AmountPlantedAtBadge";
import ObjectUtils, {MIN_DATE} from "../../../../../common/ObjectUtils";
import {useOnFocusOnceEffect} from "../../../../../common/hooks/Hooks";
import renderCardHeader from "../../../../../common/components/renderCardHeader";
import PlantService from "../../../../../services/PlantService";
import renderBackAction from "../../../../../common/components/renderBackAction";
import Badge from "../../../../../common/components/Badge";
import PlantAvatarHeader from "./components/PlantDetailHeader";
import PlantDetailHeader from "./components/PlantDetailHeader";

export default () => {

    const navigation = useNavigation<PlantsStackNavigationProp<PlantsStackRoute.PLANTS_EDIT>>();
    const route = useRoute<PlantsStackRouteProp<PlantsStackRoute.PLANTS_EDIT>>();

    const [plant, setPlant] = useState(route.params.plant || {} as Plant)
    const [lastTimeWateredDialogVisible, setLastTimeWateredDialogVisible] = useState(false);
    const [lastTimeFertilisedDialogVisible, setLastTimeFertilisedDialogVisible] = useState(false);
    const [lastTimeSprayedDialogVisible, setLastTimeSprayedDialogVisible] = useState(false);

    useOnFocusOnceEffect(() => {
        PlantService.getPlant(plant.id!).then((plant) => {
            setPlant(plant);
        });
    });

    const edit = async () => {
        navigation.navigate({name: PlantsStackRoute.PLANTS_EDIT, params: {plant}});
    }

    const openAvatarDetail = () => {
        navigation.navigate({name: PlantsStackRoute.PLANTS_AVATAR_DETAIL, params: {plant}});
    }

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

    const formatDate = (date?: string) => {
        return ObjectUtils.formatIsoDateString(date);
    }

    const updatePlant = async () => {
        await PlantService.savePlant(plant);
        setPlant({...plant});
    }

    const updateLastTimeWatered = async (date?: Date) => {
        setLastTimeWateredDialogVisible(false);
        plant.lastTimeWatered = date ? date.toISOString() : undefined;
        await updatePlant();
    }

    const updateLastTimeFertilised = async (date?: Date) => {
        setLastTimeFertilisedDialogVisible(false);
        plant.lastTimeFertilised = date ? date.toISOString() : undefined;
        await updatePlant();
    }

    const updateLastTimeSprayed = async (date?: Date) => {
        setLastTimeSprayedDialogVisible(false);
        plant.lastTimeSprayed = date ? date.toISOString() : undefined;
        await updatePlant();
    }

    const plantActivities = [
        {
            label: i18n.t('LAST_TIME_WATERED'),
            value: formatDate(plant.lastTimeWatered),
            icon: 'droplet-outline',
            onTrashPress: () => updateLastTimeWatered(),
            onCalendarPress: () => setLastTimeWateredDialogVisible(true)
        },
        {
            label: i18n.t('LAST_TIME_FERTILISED'),
            value: formatDate(plant.lastTimeFertilised),
            icon: 'flash-outline',
            onTrashPress: () => updateLastTimeFertilised(),
            onCalendarPress: () => setLastTimeFertilisedDialogVisible(true)
        },
        {
            label: i18n.t('LAST_TIME_SPRAYED'),
            value: formatDate(plant.lastTimeSprayed),
            icon: 'shield-outline',
            onTrashPress: () => updateLastTimeSprayed(),
            onCalendarPress: () => setLastTimeSprayedDialogVisible(true)
        }
    ];

    const renderActivities = (entry: ListRenderItemInfo<any>) => {
        const iconLeft = (props: any) => (
            <Icon {...props} name={entry.item.icon}/>
        );

        const calendarIcon = (props: any) => (
            <Icon {...props} name="calendar-outline"/>
        );

        const trashIcon = (props: any) => (
            <Icon {...props} name="trash-outline"/>
        );

        const button = (props: any) => {
            return (
                <React.Fragment>
                    <Button {...props} accessoryRight={trashIcon} appearance="ghost" status="danger"
                            onPress={entry.item.onTrashPress}/>
                    <Button {...props} accessoryRight={calendarIcon} appearance="ghost"
                            onPress={entry.item.onCalendarPress}/>
                </React.Fragment>
            )
        };

        return (
            <ListItem title={entry.item.value}
                      description={entry.item.label}
                      accessoryLeft={iconLeft}
                      accessoryRight={button}
                      disabled={true}/>
        );
    };

    const avatar = plant.avatar ? {uri: plant.avatar} : require('../../../../../../assets/plant-avatar-placeholder.png');

    return (
        <React.Fragment>
            <TopNavigation title={renderTopNavigationTitle(plant.name || '')}
                           alignment="center"
                           accessoryLeft={renderBackAction(true)}
                           accessoryRight={EditAction}/>
            <Divider/>
            <Layout style={styles.layout} level="2">
                <ScrollView>
                    <PlantDetailHeader plant={plant}/>
                    <Divider/>
                    <View style={styles.contentContainer}>
                        <Card style={styles.card} header={renderCardHeader("Allgemeine Informationen")} status="basic"
                              disabled={true}>
                            <CardListContainer>
                                <React.Fragment>
                                    <List data={plantAttributes} renderItem={renderPlantAttributes}
                                          ItemSeparatorComponent={Divider}/>
                                    {plant.detailLink1 &&
                                    <Divider/>
                                    }
                                </React.Fragment>
                            </CardListContainer>
                            {plant.detailLink1 &&
                            <Button accessoryLeft={LinkIcon}
                                    appearance="outline"
                                    style={styles.button}
                                    onPress={() => Linking.openURL(plant.detailLink1!)}>
                                {ObjectUtils.isDefined(plant.detailLinkName1) ? i18n.t(plant.detailLinkName1!) : 'UNKNOWN'}
                            </Button>
                            }
                        </Card>
                        <Card style={styles.card} header={renderCardHeader("Aktivitäten")} status="basic"
                              disabled={true}>
                            <CardListContainer>
                                <List data={plantActivities} renderItem={renderActivities}
                                      ItemSeparatorComponent={Divider}/>
                            </CardListContainer>
                        </Card>
                    </View>
                </ScrollView>

                <Modal visible={lastTimeWateredDialogVisible}
                       backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.75)'}}
                       onBackdropPress={() => setLastTimeWateredDialogVisible(false)}>
                    <Card>
                        <Calendar
                            style={styles.datePicker}
                            onSelect={date => updateLastTimeWatered(date)}
                            min={MIN_DATE}
                        />
                    </Card>
                </Modal>

                <Modal visible={lastTimeFertilisedDialogVisible}
                       backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.75)'}}
                       onBackdropPress={() => setLastTimeFertilisedDialogVisible(false)}>
                    <Card>
                        <Calendar
                            style={styles.datePicker}
                            onSelect={date => updateLastTimeFertilised(date)}
                            min={MIN_DATE}
                        />
                    </Card>
                </Modal>

                <Modal visible={lastTimeSprayedDialogVisible}
                       backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.75)'}}
                       onBackdropPress={() => setLastTimeSprayedDialogVisible(false)}>
                    <Card>
                        <Calendar
                            style={styles.datePicker}
                            onSelect={date => updateLastTimeSprayed(date)}
                            min={MIN_DATE}
                        />
                    </Card>
                </Modal>

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
    card: {
        marginBottom: 15
    },
    button: {
        marginTop: 30
    },
    datePicker: {
        marginHorizontal: -25,
        marginVertical: -20
    }
});