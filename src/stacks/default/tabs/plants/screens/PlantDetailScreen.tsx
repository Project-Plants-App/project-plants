import {Button, Card, Divider, Icon, Layout, List, ListItem, Modal, Text, TopNavigation} from "@ui-kitten/components";
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
import TopNavigationTitle from "../../../../../common/components/TopNavigationTitle";
import {formatAsIsoString, formatIsoDateStringAsTimeAgo, isDefined, MIN_DATE} from "../../../../../common/Utils";
import {useOnFocusOnceEffect} from "../../../../../common/hooks/Hooks";
import renderCardHeader from "../../../../../common/components/CardHeader";
import PlantService from "../../../../../services/PlantService";
import BackAction from "../../../../../common/components/BackAction";
import PlantDetailHeader from "./components/PlantDetailHeader";
import EditAction from "../../../../../common/components/EditAction";
import {LinkIcon} from "../../../../../common/components/Icons";
import MomentBackedCalendar from "../../../../../common/components/MomentBackedCalendar";
import {Moment} from "moment";

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

    async function edit() {
        navigation.navigate({name: PlantsStackRoute.PLANTS_EDIT, params: {plant}});
    }

    function renderPlantAttributes(entry: ListRenderItemInfo<any>) {
        return (
            <ListItem title={entry.item.value} description={entry.item.label} disabled={true}/>
        )
    }

    async function updatePlant() {
        await PlantService.savePlant(plant);
        setPlant({...plant});
    }

    async function updateLastTimeWatered(date?: Moment) {
        setLastTimeWateredDialogVisible(false);
        plant.lastTimeWatered = formatAsIsoString(date);
        await updatePlant();
    }

    async function updateLastTimeFertilised(date?: Moment) {
        setLastTimeFertilisedDialogVisible(false);
        plant.lastTimeFertilised = formatAsIsoString(date);
        await updatePlant();
    }

    async function updateLastTimeSprayed(date?: Moment) {
        setLastTimeSprayedDialogVisible(false);
        plant.lastTimeSprayed = formatAsIsoString(date);
        await updatePlant();
    }

    function renderActivities(entry: ListRenderItemInfo<any>) {
        const iconLeft = (props: any) => (
            <Icon {...props} name={entry.item.icon} pack={entry.item.iconPack || 'eva'}/>
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
                            onPress={entry.item.onTrashPress} disabled={entry.item.disabled}/>
                    <Button {...props} accessoryRight={calendarIcon} appearance="ghost"
                            onPress={entry.item.onCalendarPress} disabled={entry.item.disabled}/>
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
    }

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

    const plantActivities = [
        {
            label: i18n.t('LAST_TIME_WATERED'),
            value: plant.automaticallyWatered ? i18n.t('AUTOMATICALLY_WATERED_SHORT') : formatIsoDateStringAsTimeAgo(plant.lastTimeWatered),
            icon: plant.automaticallyWatered ? 'droplet-automatic-outline' : 'droplet-outline',
            iconPack: plant.automaticallyWatered ? 'assets' : undefined,
            onTrashPress: () => updateLastTimeWatered(),
            onCalendarPress: () => setLastTimeWateredDialogVisible(true),
            disabled: plant.automaticallyWatered
        },
        {
            label: i18n.t('LAST_TIME_FERTILISED'),
            value: formatIsoDateStringAsTimeAgo(plant.lastTimeFertilised),
            icon: 'flash-outline',
            onTrashPress: () => updateLastTimeFertilised(),
            onCalendarPress: () => setLastTimeFertilisedDialogVisible(true)
        },
        {
            label: i18n.t('LAST_TIME_SPRAYED'),
            value: formatIsoDateStringAsTimeAgo(plant.lastTimeSprayed),
            icon: 'shield-outline',
            onTrashPress: () => updateLastTimeSprayed(),
            onCalendarPress: () => setLastTimeSprayedDialogVisible(true)
        }
    ];

    return (
        <React.Fragment>
            <TopNavigation title={TopNavigationTitle(plant.name || '')}
                           alignment="center"
                           accessoryLeft={BackAction(true)}
                           accessoryRight={EditAction(() => edit())}/>
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
                                    {isDefined(plant.detailLinkName1) ? i18n.t(plant.detailLinkName1!) : 'UNKNOWN'}
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
                        {plant.notes &&
                            <Card style={styles.card} header={renderCardHeader("Notizen")} status="basic"
                                  disabled={true}>
                                <Text>{plant.notes}</Text>
                            </Card>
                        }
                    </View>
                </ScrollView>

                <Modal visible={lastTimeWateredDialogVisible}
                       backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.75)'}}
                       onBackdropPress={() => setLastTimeWateredDialogVisible(false)}>
                    <Card>
                        <MomentBackedCalendar
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
                        <MomentBackedCalendar
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
                        <MomentBackedCalendar
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