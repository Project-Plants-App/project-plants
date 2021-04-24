import {
    Button,
    Card,
    Datepicker,
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
import {KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View} from "react-native";
import {StackActions, useNavigation, useRoute} from "@react-navigation/native";
import {PlantsStackNavigationProp, PlantsStackRouteProp, PlantsTabRoute} from "../PlantsTabRoute";
import {Plant} from "../../../../../model/Plant";
import PlantRepository from "../../../../../repositories/PlantRepository";
import {PreferredLocation} from "../../../../../model/PreferredLocation";
import {WaterDemand} from "../../../../../model/WaterDemand";
import i18n, {translateEnumValue} from "../../../../../i18n";
import * as ImagePicker from 'expo-image-picker';
import {ImagePickerOptions, ImagePickerResult, MediaTypeOptions} from 'expo-image-picker';
import PlantAvatar from "../../../../../common/components/PlantAvatar";
import ImageDataUriHelper from "../../../../../common/ImageDataUriHelper";
import IndexPathHelper from "../../../../../common/IndexPathHelper";
import {WinterProof} from "../../../../../model/WinterProof";
import ObjectUtils from "../../../../../common/ObjectUtils";
import renderTopNavigationTitle from "../../../../../common/components/renderTopNavigationTitle";
import PlantService from "../../../../../services/PlantService";

const IMAGE_PICKER_OPTIONS: ImagePickerOptions = {
    mediaTypes: MediaTypeOptions.Images
};

const convertIndexPathToAmountValue = (indexPath: IndexPath) => {
    return indexPath.row + 1;
}

const convertAmountValueToIndexPath = (amount?: number) => {
    return ObjectUtils.isDefined(amount) ?
        IndexPathHelper.createIndexPath(amount! - 1) :
        IndexPathHelper.createIndexPath(0)
}

export default () => {

    const navigation = useNavigation<PlantsStackNavigationProp<PlantsTabRoute.PLANTS_EDIT>>();
    const route = useRoute<PlantsStackRouteProp<PlantsTabRoute.PLANTS_EDIT>>();

    const [plant] = useState(route.params.plant || {} as Plant)

    const [avatar, setAvatar] = useState<undefined | string>(plant.avatar)
    const [name, setName] = useState(ObjectUtils.isDefined(plant.name) ? plant.name : '');
    const [botanicalName, setBotanicalName] = useState(ObjectUtils.isDefined(plant.botanicalName) ? plant.botanicalName : '');
    const [planted, setPlanted] = useState(ObjectUtils.parseIsoDateString(plant.planted));
    const [amount, setAmount] = useState(convertAmountValueToIndexPath(plant.amount));
    const [waterDemand, setWaterDemand] = useState(IndexPathHelper.createIndexPath(plant.waterDemand, WaterDemand.WATER_DEMAND_UNDEFINED));
    const [preferredLocation, setPreferredLocation] = useState(IndexPathHelper.createIndexPath(plant.preferredLocation, PreferredLocation.PREFERRED_LOCATION_UNDEFINED));
    const [winterProof, setWinterProof] = useState(IndexPathHelper.createIndexPath(plant.winterProof, WinterProof.WINTER_PROOF_UNDEFINED));

    const handleImagePickerResult = (result: ImagePickerResult) => {
        if (!result.cancelled) {
            setAvatar(result.uri)
        }
    }

    const chooseAvatarFromMediaLibrary = async () => {
        let response = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!response.granted) {
            return;
        }

        handleImagePickerResult(await ImagePicker.launchImageLibraryAsync(IMAGE_PICKER_OPTIONS));
    };

    const createAvatarWithCamera = async () => {
        let response = await ImagePicker.requestCameraPermissionsAsync();
        if (!response.granted) {
            return;
        }

        handleImagePickerResult(await ImagePicker.launchCameraAsync(IMAGE_PICKER_OPTIONS));
    };

    const cancel = () => {
        navigation.goBack();
    }

    const save = async () => {
        plant.name = name;
        plant.avatar = avatar;
        plant.waterDemand = waterDemand.row;
        plant.preferredLocation = preferredLocation.row;
        plant.winterProof = winterProof.row;
        plant.planted = planted?.toISOString();
        plant.amount = convertIndexPathToAmountValue(amount);

        if (ObjectUtils.isDefined(plant.id)) {
            await PlantService.savePlant(plant);
            navigation.goBack();
        } else {
            await PlantService.savePlant(plant);
            navigation.replace(PlantsTabRoute.PLANTS_DETAIL, {plant});
        }
    }

    const deletePlant = async () => {
        await PlantService.savePlant(plant);

        navigation.dispatch(StackActions.popToTop());
    }

    const CameraIcon = (props: any) => (
        <Icon {...props} name="camera-outline"/>
    );

    const MediaLibraryIcon = (props: any) => (
        <Icon {...props} name="image-outline"/>
    );

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

    const CalendarIcon = (props: any) => (
        <Icon {...props} name='calendar'/>
    );

    const renderEnumOptions = (enumType: any) => {
        const options = [];
        for (const enumValue in enumType) {
            const enumValueAsNumber = Number(enumValue);
            if (!isNaN(enumValueAsNumber)) {
                options.push(<SelectItem title={translateEnumValue(enumValueAsNumber, enumType)}
                                         key={enumValueAsNumber}/>)
            }
        }

        return options;
    }

    const renderAmountOptions = () => {
        const options = [];
        for (let i = 1; i <= 50; i++) {
            options.push(<SelectItem title={i} key={i}/>)
        }

        return options;
    }

    return (
        <React.Fragment>
            <TopNavigation
                title={renderTopNavigationTitle(ObjectUtils.isDefined(plant.id) ? (plant.name || '') : i18n.t('NEW'))}
                alignment="center"
                accessoryLeft={CancelAction}
                accessoryRight={SaveAction}/>
            <Divider/>
            <Layout style={styles.layout} level="2">
                <KeyboardAvoidingView style={{flex: 1}}
                                      behavior={Platform.OS === "ios" ? "padding" : "height"}
                                      keyboardVerticalOffset={100}>
                    <ScrollView>
                        <View style={styles.contentContainer}>
                            <Card style={styles.card} status="basic" disabled={true}>
                                <PlantAvatar avatar={avatar} size="giant" style={styles.avatar}/>
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
                                <Datepicker
                                    label={i18n.t('PLANTED')}
                                    style={styles.input}
                                    date={planted}
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
                            <Button onPress={deletePlant}
                                    appearance="outline"
                                    status="danger">
                                Löschen
                            </Button>
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