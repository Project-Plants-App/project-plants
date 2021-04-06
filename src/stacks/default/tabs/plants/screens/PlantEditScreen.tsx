import {
    Button,
    Card,
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

const IMAGE_PICKER_OPTIONS: ImagePickerOptions = {
    mediaTypes: MediaTypeOptions.Images,
    base64: true
};

export default () => {

    const navigation = useNavigation<PlantsStackNavigationProp<PlantsTabRoute.PLANTS_EDIT>>();
    const route = useRoute<PlantsStackRouteProp<PlantsTabRoute.PLANTS_EDIT>>();

    const [plant] = useState(route.params.plant || {} as Plant)

    const [avatar, setAvatar] = useState<undefined | string>(plant.avatar)
    const [name, setName] = useState(plant.name || '')
    const [waterDemand, setWaterDemand] = useState(IndexPathHelper.createIndexPath(plant.waterDemand, WaterDemand.WATER_DEMAND_UNDEFINED))
    const [preferredLocation, setPreferredLocation] = useState(IndexPathHelper.createIndexPath(plant.preferredLocation, PreferredLocation.PREFERRED_LOCATION_UNDEFINED))
    const [winterProof, setWinterProof] = useState(IndexPathHelper.createIndexPath(plant.winterProof, WinterProof.WINTER_PROOF_UNDEFINED))

    const handleImagePickerResult = (result: ImagePickerResult) => {
        if (!result.cancelled) {
            setAvatar(ImageDataUriHelper.toImageDataUri(result.uri, result.base64!))
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
        if (plant.id !== undefined) {
            navigation.goBack();
        } else {
            navigation.dispatch(StackActions.popToTop());
        }
    }

    const save = async () => {
        plant.name = name;
        plant.avatar = avatar;
        plant.waterDemand = waterDemand.row;
        plant.preferredLocation = preferredLocation.row;
        plant.winterProof = winterProof.row;

        await PlantRepository.insertOrUpdatePlant(plant);

        navigation.dispatch(StackActions.popToTop());
    }

    const deletePlant = async () => {
        await PlantRepository.deletePlant(plant);

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

    return (
        <React.Fragment>
            <TopNavigation title={plant.id === undefined ? i18n.t('NEW') : plant.name}
                           alignment="center"
                           accessoryLeft={CancelAction}
                           accessoryRight={SaveAction}/>
            <Divider/>
            <Layout style={styles.layout} level="2">
                <KeyboardAvoidingView style={{flex: 1}}
                                      behavior={Platform.OS === "ios" ? "padding" : "height"}
                                      keyboardVerticalOffset={100}>
                    <ScrollView>
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
                        <Button onPress={deletePlant} appearance="outline" status="danger"
                                style={styles.deleteButton}>Löschen</Button>
                        }
                    </ScrollView>
                </KeyboardAvoidingView>
            </Layout>
            <Divider/>
        </React.Fragment>
    )

}


const styles = StyleSheet.create({
    layout: {
        flex: 1,
        paddingTop: 15
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
        margin: 15,
        marginTop: 0
    },
    deleteButton: {
        marginHorizontal: 15
    }
});