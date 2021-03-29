import {
    Divider,
    Icon,
    IndexPath,
    Input,
    Layout,
    Select,
    SelectItem,
    Text,
    TopNavigation,
    TopNavigationAction
} from "@ui-kitten/components";
import React, {useState} from "react";
import {StyleSheet} from "react-native";
import {useNavigation, useRoute} from "@react-navigation/native";
import {PlantsStackNavigationProp, PlantsStackRouteProp, PlantsTabRoute} from "../PlantsTabRoute";
import {Plant} from "../../../../../model/Plant";
import PlantRepository from "../../../../../repositories/PlantRepository";
import {PreferredLocation} from "../../../../../model/PreferredLocation";
import {WaterDemand} from "../../../../../model/WaterDemand";
import {PreferredPhLevel} from "../../../../../model/PreferredPhLevel";

export default () => {

    const navigation = useNavigation<PlantsStackNavigationProp<PlantsTabRoute.PLANTS_EDIT>>();
    const route = useRoute<PlantsStackRouteProp<PlantsTabRoute.PLANTS_EDIT>>();

    const [plant] = useState(route.params.plant || {} as Plant)

    const [name, setName] = useState(plant.name || '')
    const [waterDemand, setWaterDemand] = useState(new IndexPath(plant.waterDemand || 0))
    const [preferredLocation, setPreferredLocation] = useState(new IndexPath(plant.preferredLocation || 0))
    const [preferredPhLevel, setPreferredPhLevel] = useState(new IndexPath(plant.preferredPhLevel || 0))

    const cancel = () => {
        navigation.goBack();
    }

    const save = async () => {
        plant.name = name;
        plant.waterDemand = waterDemand.row;
        plant.preferredLocation = preferredLocation.row;
        plant.preferredPhLevel = preferredPhLevel.row;

        await PlantRepository.insertOrUpdatePlant(plant);

        navigation.goBack();
    }

    const CancelIcon = (props: any) => (
        <Icon {...props} name="close-outline"/>
    );

    const CancelAction = () => (
        <TopNavigationAction icon={CancelIcon} onPress={() => cancel()}/>
    );

    const SaveIcon = (props: any) => (
        <Icon {...props} name="save-outline"/>
    );

    const SaveAction = () => (
        <TopNavigationAction icon={SaveIcon} onPress={() => save()}/>
    );

    return (
        <React.Fragment>
            <TopNavigation title={`Edit Plant ${plant.id !== undefined ? plant.id : 'NEW'}`}
                           alignment="center"
                           accessoryLeft={CancelAction}
                           accessoryRight={SaveAction}/>
            <Divider/>
            <Layout style={{flex: 1}}>
                <Input label="Name" style={styles.input} value={name} onChangeText={setName}/>
                <Select label="Wasserbedarf" style={styles.input}
                        selectedIndex={waterDemand}
                        value={() => <Text>{WaterDemand[waterDemand.row]}</Text>}
                        onSelect={index => setWaterDemand(index as IndexPath)}>
                    <SelectItem title="Gering"/>
                    <SelectItem title="Mittel"/>
                    <SelectItem title="Hoch"/>
                </Select>
                <Select label="Standort" style={styles.input}
                        selectedIndex={preferredLocation}
                        value={() => <Text>{PreferredLocation[preferredLocation.row]}</Text>}
                        onSelect={index => setPreferredLocation(index as IndexPath)}>
                    <SelectItem title="Schatten"/>
                    <SelectItem title="Halbschatten"/>
                    <SelectItem title="Sonne"/>
                </Select>
                <Select label="Gewünschter PH-Wert" style={styles.input}
                        selectedIndex={preferredPhLevel}
                        value={() => <Text>{PreferredPhLevel[preferredPhLevel.row]}</Text>}
                        onSelect={index => setPreferredPhLevel(index as IndexPath)}>
                    <SelectItem title="Egal"/>
                    <SelectItem title="Tief"/>
                    <SelectItem title="Hoch"/>
                </Select>
            </Layout>
            <Divider/>
        </React.Fragment>
    )

}


const styles = StyleSheet.create({
    input: {
        margin: 15,
        marginBottom: 0
    }
});