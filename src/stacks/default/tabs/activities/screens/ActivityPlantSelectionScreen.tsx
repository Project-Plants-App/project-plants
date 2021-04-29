import {StackActions, useNavigation, useRoute} from "@react-navigation/native";
import {Button, Card, CheckBox, Divider, Layout, TopNavigation} from "@ui-kitten/components";
import React, {useState} from "react";
import {ScrollView, StyleSheet, View} from "react-native";
import {ActivitiesStackNavigationProp, ActivitiesStackRoute, ActivitiesStackRouteProp} from "../ActivitiesStackRoute";
import renderTopNavigationTitle from "../../../../../common/components/renderTopNavigationTitle";
import PlantRepository from "../../../../../repositories/PlantRepository";
import {useOnFocusOnceEffect} from "../../../../../common/hooks/Hooks";
import {Plant} from "../../../../../model/Plant";
import {ActivityType} from "../../../../../model/ActivityType";
import PlantService from "../../../../../services/PlantService";
import renderBackAction from "../../../../../common/components/renderBackAction";

export default () => {

    const navigation = useNavigation<ActivitiesStackNavigationProp<ActivitiesStackRoute.ACTIVITY_PLANT_SELECTION>>();
    const route = useRoute<ActivitiesStackRouteProp<ActivitiesStackRoute.ACTIVITY_PLANT_SELECTION>>();

    const [plants, setPlants] = useState<Plant[]>([])
    const [selectedPlants, setSelectedPlants] = useState<Plant[]>([])

    useOnFocusOnceEffect(() => {
        PlantRepository.selectAllPlants().then((plants) => {
            setPlants(plants);
        });
    });

    const save = async () => {
        const activityType = route.params.activityType;
        const activityDate = route.params.activityDate;

        for (const plant of selectedPlants) {
            switch (activityType) {
                case ActivityType.ACTIVITY_TYPE_WATERED:
                    plant.lastTimeWatered = activityDate;
                    break;
                case ActivityType.ACTIVITY_TYPE_FERTILISED:
                    plant.lastTimeFertilised = activityDate;
                    break;
                case ActivityType.ACTIVITY_TYPE_SPRAYED:
                    plant.lastTimeSprayed = activityDate;
                    break;
            }

            await PlantService.savePlant(plant);
        }

        navigation.dispatch(StackActions.popToTop());
    }

    const toggleAllPlantsSelection = () => {
        if (areAllPlantsSelected()) {
            setSelectedPlants([]);
        } else {
            setSelectedPlants(plants.slice());
        }
    }

    const areAllPlantsSelected = () => {
        return selectedPlants.length === plants.length;
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
            <TopNavigation title={renderTopNavigationTitle("Pflanzen wählen")}
                           alignment="center"
                           accessoryLeft={renderBackAction()}/>
            <Divider/>
            <Layout style={styles.layout} level="2">
                <ScrollView>
                    <View style={styles.contentContainer}>
                        <Card status="basic" style={styles.card}>
                            <CheckBox checked={areAllPlantsSelected()}
                                      onChange={() => toggleAllPlantsSelection()}
                                      style={styles.firstCheckbox}>
                                Alle Pflanzen
                            </CheckBox>
                            <Divider/>
                            {renderPlantOptions()}
                        </Card>
                    </View>
                </ScrollView>
            </Layout>
            <Divider/>
            <Layout style={styles.buttonContainer}>
                <Button onPress={save}
                        disabled={selectedPlants.length === 0}>
                    Speichern
                </Button>
            </Layout>
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
    firstCheckbox: {
        marginBottom: 15
    },
    checkbox: {
        marginTop: 15
    },
    buttonContainer: {
        padding: 15
    }
});