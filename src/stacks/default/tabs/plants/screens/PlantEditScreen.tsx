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
import i18n, {translatePreferredLocation, translatePreferredPhLevel, translateWaterDemand} from "../../../../../i18n";

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
            <TopNavigation title={plant.id === undefined ? i18n.t('NEW') : plant.name}
                           alignment="center"
                           accessoryLeft={CancelAction}
                           accessoryRight={SaveAction}/>
            <Divider/>
            <Layout style={{flex: 1}}>
                <Input label={i18n.t('NAME')} style={styles.input} value={name} onChangeText={setName}/>
                <Select label={i18n.t('WATER_DEMAND')} style={styles.input}
                        selectedIndex={waterDemand}
                        value={() => <Text>{translateWaterDemand(waterDemand.row)}</Text>}
                        onSelect={index => setWaterDemand(index as IndexPath)}>
                    <SelectItem title={translateWaterDemand(WaterDemand.WATER_DEMAND_LOW)}/>
                    <SelectItem title={translateWaterDemand(WaterDemand.WATER_DEMAND_MEDIUM)}/>
                    <SelectItem title={translateWaterDemand(WaterDemand.WATER_DEMAND_HIGH)}/>
                </Select>
                <Select label={i18n.t('PREFERRED_LOCATION')} style={styles.input}
                        selectedIndex={preferredLocation}
                        value={() => <Text>{translatePreferredLocation(preferredLocation.row)}</Text>}
                        onSelect={index => setPreferredLocation(index as IndexPath)}>
                    <SelectItem title={translatePreferredLocation(PreferredLocation.PREFERRED_LOCATION_SHADOW)}/>
                    <SelectItem title={translatePreferredLocation(PreferredLocation.PREFERRED_LOCATION_HALF_SHADOWS)}/>
                    <SelectItem title={translatePreferredLocation(PreferredLocation.PREFERRED_LOCATION_SUNNY)}/>
                </Select>
                <Select label={i18n.t('PREFERRED_PH_LEVEL')} style={styles.input}
                        selectedIndex={preferredPhLevel}
                        value={() => <Text>{translatePreferredPhLevel(preferredPhLevel.row)}</Text>}
                        onSelect={index => setPreferredPhLevel(index as IndexPath)}>
                    <SelectItem title={translatePreferredPhLevel(PreferredPhLevel.PREFERRED_PH_LEVEL_NO_MATTER)}/>
                    <SelectItem title={translatePreferredPhLevel(PreferredPhLevel.PREFERRED_PH_LEVEL_LOW)}/>
                    <SelectItem title={translatePreferredPhLevel(PreferredPhLevel.PREFERRED_PH_LEVEL_HIGH)}/>
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