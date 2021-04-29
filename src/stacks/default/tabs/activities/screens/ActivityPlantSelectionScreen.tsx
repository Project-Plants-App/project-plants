import {StackActions, useNavigation, useRoute} from "@react-navigation/native";
import {Button, Card, CheckBox, Divider, Layout, Text, TopNavigation} from "@ui-kitten/components";
import React, {useState} from "react";
import {ScrollView, StyleSheet, View} from "react-native";
import {ActivitiesStackNavigationProp, ActivitiesStackRouteProp, ActivitiesTabRoute} from "../ActivitiesTabRoute";
import i18n from "../../../../../i18n";
import renderTopNavigationTitle from "../../../../../common/components/renderTopNavigationTitle";
import PlantRepository from "../../../../../repositories/PlantRepository";
import {useOnFocusOnceEffect} from "../../../../../common/hooks/Hooks";
import {Plant} from "../../../../../model/Plant";
import {ActivityType} from "../../../../../model/ActivityType";
import PlantService from "../../../../../services/PlantService";

export default () => {

    const navigation = useNavigation<ActivitiesStackNavigationProp<ActivitiesTabRoute.ACTIVITY_PLANT_SELECTION>>();
    const route = useRoute<ActivitiesStackRouteProp<ActivitiesTabRoute.ACTIVITY_PLANT_SELECTION>>();

    const [plants, setPlants] = useState<Plant[]>([])
    const [selectedPlants, setSelectedPlants] = useState<Plant[]>([])

    useOnFocusOnceEffect(() => {
        PlantRepository.selectAllPlants().then((plants) => {
            setPlants(plants);
        });
    });

    const save = async () => {
        const activityTypes = route.params.activityTypes;
        const activityDate = route.params.activityDate;

        for (const plant of selectedPlants) {
            for (const activityType of activityTypes) {
                switch (activityType) {
                    case ActivityType.LAST_TIME_WATERED:
                        plant.lastTimeWatered = activityDate;
                        break;
                    case ActivityType.LAST_TIME_FERTILISED:
                        plant.lastTimeFertilised = activityDate;
                        break;
                    case ActivityType.LAST_TIME_SPRAYED:
                        plant.lastTimeSprayed = activityDate;
                        break;
                }
            }

            await PlantService.savePlant(plant);
        }

        navigation.dispatch(StackActions.popToTop());
    }

    const togglePlantSelection = (plant: Plant) => {
        const index = selectedPlants.indexOf(plant);
        if (index !== -1) {
            selectedPlants.splice(index, 1);
        } else {
            selectedPlants.push(plant);
        }

        setSelectedPlants(selectedPlants.slice());
    }

    const isPlantSelected = (plant: Plant) => {
        return selectedPlants.indexOf(plant) !== -1;
    }

    const renderPlantOptions = () => {
        return plants
            .map((plant) => (
                <CheckBox checked={isPlantSelected(plant)}
                          onChange={() => togglePlantSelection(plant)}
                          key={plant.id!}
                          style={styles.checkbox}>
                    {plant.name}
                </CheckBox>
            ));
    }

    return (
        <React.Fragment>
            <TopNavigation title={renderTopNavigationTitle(i18n.t('ACTIVITIES'))}
                           alignment="center"/>
            <Divider/>
            <Layout style={styles.layout} level="2">
                <ScrollView>
                    <View style={styles.contentContainer}>
                        <Card status="basic" style={styles.card}>
                            <Text category="s1" style={styles.text}>
                                Bei welchem Pflanzen möchtest du die Aktivitäten aktualisieren?
                            </Text>
                            {renderPlantOptions()}
                            <Button onPress={save}
                                    disabled={selectedPlants.length === 0}
                                    style={styles.button}>
                                Speichern
                            </Button>
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
    card: {
        marginBottom: 15
    },
    text: {
        textAlign: "center"
    },
    checkbox: {
        marginTop: 15
    },
    button: {
        margin: 15,
        marginBottom: 0
    }
});