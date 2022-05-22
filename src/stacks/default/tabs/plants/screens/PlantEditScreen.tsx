import {
    Button,
    Card,
    Divider,
    IndexPath,
    Input,
    Layout,
    Select,
    SelectItem,
    Text,
    TopNavigation
} from "@ui-kitten/components";
import React, {useState} from "react";
import {Alert, KeyboardAvoidingView, Linking, Platform, ScrollView, StyleSheet, View} from "react-native";
import {StackActions, useNavigation, useRoute} from "@react-navigation/native";
import {PlantsStackNavigationProp, PlantsStackRoute, PlantsStackRouteProp} from "../PlantsStackRoute";
import {Plant} from "../../../../../model/Plant";
import {PreferredLocation} from "../../../../../model/PreferredLocation";
import {WaterDemand} from "../../../../../model/WaterDemand";
import i18n, {translateEnumValue} from "../../../../../i18n";
import * as ImagePicker from 'expo-image-picker';
import {ImagePickerOptions, ImagePickerResult, MediaTypeOptions} from 'expo-image-picker';
import PlantAvatar from "../../../../../common/components/PlantAvatar";
import {WinterProof} from "../../../../../model/WinterProof";
import {
    createIndexPath,
    enumValues,
    formatAsIsoString,
    isDefined,
    MIN_DATE,
    parseIsoDateString
} from "../../../../../common/Utils";
import TopNavigationTitle from "../../../../../common/components/TopNavigationTitle";
import PlantService from "../../../../../services/PlantService";
import CancelAction from "../../../../../common/components/CancelAction";
import SaveAction from "../../../../../common/components/SaveAction";
import {CalendarIcon, CameraIcon, MediaLibraryIcon} from "../../../../../common/components/Icons";
import MomentBackedDatepicker from "../../../../../common/components/MomentBackedDatepicker";

const IMAGE_PICKER_OPTIONS: ImagePickerOptions = {
    mediaTypes: MediaTypeOptions.Images
};

const convertIndexPathToAmountValue = (indexPath: IndexPath) => {
    return indexPath.row + 1;
}

const convertAmountValueToIndexPath = (amount?: number) => {
    return isDefined(amount) ?
        createIndexPath(amount! - 1) :
        createIndexPath(0)
}

export default () => {

    const navigation = useNavigation<PlantsStackNavigationProp<PlantsStackRoute.PLANTS_EDIT>>();
    const route = useRoute<PlantsStackRouteProp<PlantsStackRoute.PLANTS_EDIT>>();

    const [plant] = useState(route.params.plant || {} as Plant)

    const [avatar, setAvatar] = useState<undefined | string>(plant.avatar)
    const [name, setName] = useState(isDefined(plant.name) ? plant.name : '');
    const [botanicalName, setBotanicalName] = useState(isDefined(plant.botanicalName) ? plant.botanicalName : '');
    const [planted, setPlanted] = useState(parseIsoDateString(plant.planted));
    const [amount, setAmount] = useState(convertAmountValueToIndexPath(plant.amount));
    const [waterDemand, setWaterDemand] = useState(createIndexPath(plant.waterDemand, WaterDemand.WATER_DEMAND_UNDEFINED));
    const [preferredLocation, setPreferredLocation] = useState(createIndexPath(plant.preferredLocation, PreferredLocation.PREFERRED_LOCATION_UNDEFINED));
    const [winterProof, setWinterProof] = useState(createIndexPath(plant.winterProof, WinterProof.WINTER_PROOF_UNDEFINED));

    function handleImagePickerResult(result: ImagePickerResult) {
        if (!result.cancelled) {
            setAvatar(result.uri)
        }
    }

    async function chooseAvatarFromMediaLibrary() {
        let response = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!response.granted) {
            askUserToChangeAppPermissions(
                'Zugriff auf deine Fotos',
                'Erlaube in den Einstellungen den Zugriff auf deine Fotos um ein Foto deiner Pflanze wählen zu können.'
            );

            return;
        }

        handleImagePickerResult(await ImagePicker.launchImageLibraryAsync(IMAGE_PICKER_OPTIONS));
    }

    async function createAvatarWithCamera() {
        let response = await ImagePicker.requestCameraPermissionsAsync();
        if (!response.granted) {
            askUserToChangeAppPermissions(
                'Zugriff auf deine Kamera',
                'Erlaube in den Einstellungen den Zugriff auf die Kamera um ein Foto deiner Pflanze schiessen zu können.'
            );

            return;
        }

        handleImagePickerResult(await ImagePicker.launchCameraAsync(IMAGE_PICKER_OPTIONS));
    }

    function askUserToChangeAppPermissions(title: string, message: string) {
        Alert.alert(
            title,
            message,
            [
                {text: 'Einstellungen', onPress: () => Linking.openSettings()},
                {text: 'Abbrechen'}
            ]
        );
    }

    function getUpdatedPlant() {
        return Object.assign(plant, {
            name,
            botanicalName,
            avatar,
            waterDemand: waterDemand.row,
            preferredLocation: preferredLocation.row,
            winterProof: winterProof.row,
            planted: formatAsIsoString(planted),
            amount: convertIndexPathToAmountValue(amount)
        });
    }

    async function save() {
        const updatedPlant = getUpdatedPlant();

        if (isDefined(updatedPlant.id)) {
            await PlantService.savePlant(updatedPlant);
            navigation.goBack();
        } else {
            await PlantService.savePlant(updatedPlant);
            navigation.replace(PlantsStackRoute.PLANTS_DETAIL, {plant: updatedPlant});
        }
    }

    async function deletePlant() {
        await PlantService.deletePlant(plant);

        navigation.dispatch(StackActions.popToTop());
    }

    async function completePlant() {
        const updatedPlant = getUpdatedPlant();

        navigation.navigate({name: PlantsStackRoute.PLANTS_PREFILL, params: {plant: updatedPlant}});
    }

    function renderEnumOptions<T>(enumType: any) {
        return enumValues<T>(enumType)
            .map((enumValue) => (
                <SelectItem title={translateEnumValue(enumValue, enumType)} key={`${enumValue}`}/>
            ));
    }

    function renderAmountOptions() {
        const options = [];
        for (let i = 1; i <= 50; i++) {
            options.push(<SelectItem title={i} key={i}/>)
        }

        return options;
    }

    return (
        <React.Fragment>
            <TopNavigation
                title={TopNavigationTitle(isDefined(plant.id) ? (plant.name || '') : i18n.t('NEW'))}
                alignment="center"
                accessoryLeft={CancelAction()}
                accessoryRight={SaveAction(() => save())}/>
            <Divider/>
            <Layout style={styles.layout} level="2">
                <KeyboardAvoidingView style={{flex: 1}}
                                      behavior={Platform.OS === "ios" ? "padding" : "height"}
                                      keyboardVerticalOffset={100}>
                    <ScrollView>
                        <View style={styles.contentContainer}>
                            <Card style={styles.card} status="basic" disabled={true}>
                                <PlantAvatar avatar={avatar} size="giant" style={styles.avatar} shape="square"/>
                                <View style={styles.avatarInputs}>
                                    <Button accessoryLeft={CameraIcon}
                                            appearance="outline"
                                            onPress={createAvatarWithCamera}
                                            style={styles.leftAvatarInput}/>
                                    <Button accessoryLeft={MediaLibraryIcon}
                                            appearance="outline"
                                            onPress={chooseAvatarFromMediaLibrary}/>
                                </View>
                                <Input label={i18n.t('NAME')} style={styles.input} value={name} onChangeText={setName}/>
                                <Input label={i18n.t('BOTANICAL_NAME')} style={styles.input} value={botanicalName}
                                       onChangeText={setBotanicalName}/>
                                <MomentBackedDatepicker
                                    label={i18n.t('PLANTED')}
                                    style={styles.input}
                                    date={planted}
                                    min={MIN_DATE}
                                    onSelect={planted => setPlanted(planted)}
                                    accessoryRight={CalendarIcon}
                                />
                                <Select label={i18n.t('AMOUNT')}
                                        style={styles.input}
                                        selectedIndex={amount}
                                        value={() => <Text>{convertIndexPathToAmountValue(amount)}</Text>}
                                        onSelect={index => setAmount(index as IndexPath)}>
                                    {renderAmountOptions()}
                                </Select>
                            </Card>
                            <Card style={styles.card} status="basic" disabled={true}>
                                <Select label={i18n.t('WATER_DEMAND')}
                                        selectedIndex={waterDemand}
                                        value={() => <Text>{translateEnumValue(waterDemand.row, WaterDemand)}</Text>}
                                        onSelect={index => setWaterDemand(index as IndexPath)}>
                                    {renderEnumOptions(WaterDemand)}
                                </Select>
                                <Select label={i18n.t('PREFERRED_LOCATION')} style={styles.input}
                                        selectedIndex={preferredLocation}
                                        value={() =>
                                            <Text>{translateEnumValue(preferredLocation.row, PreferredLocation)}</Text>}
                                        onSelect={index => setPreferredLocation(index as IndexPath)}>
                                    {renderEnumOptions(PreferredLocation)}
                                </Select>
                                <Select label={i18n.t('WINTER_PROOF')} style={styles.input}
                                        selectedIndex={winterProof}
                                        value={() =>
                                            <Text>{translateEnumValue(winterProof.row, WinterProof)}</Text>}
                                        onSelect={index => setWinterProof(index as IndexPath)}>
                                    {renderEnumOptions(WinterProof)}
                                </Select>
                            </Card>

                            {plant.id !== undefined &&
                                <Card status="basic">
                                    <Button onPress={completePlant}
                                            style={styles.firstButton}
                                            appearance="outline">
                                        Automatisch vervollständigen
                                    </Button>
                                    <Button onPress={deletePlant}
                                            appearance="outline"
                                            status="danger">
                                        Löschen
                                    </Button>
                                </Card>
                            }
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
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
        marginBottom: 15
    },
    avatar: {
        alignSelf: "center",
        marginBottom: 15,
    },
    avatarInputs: {
        flexDirection: "row",
        justifyContent: "center"
    },
    leftAvatarInput: {
        marginRight: 15
    },
    input: {
        marginTop: 15
    },
    card: {
        marginBottom: 15
    },
    firstButton: {
        marginBottom: 15
    },
    datePicker: {
        marginHorizontal: -25,
        marginVertical: -20
    }
});