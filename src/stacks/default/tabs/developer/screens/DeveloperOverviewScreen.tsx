import {Button, Card, Divider, Layout, List, ListItem, TopNavigation} from "@ui-kitten/components";
import React, {useState} from "react";
import {Alert, ListRenderItemInfo, StyleSheet, View} from "react-native";
import {useNavigation, useRoute} from "@react-navigation/native";
import TopNavigationTitle from "../../../../../common/components/TopNavigationTitle";
import {DeveloperStackNavigationProp, DeveloperStackRoute, DeveloperStackRouteProp} from "../DeveloperStackRoute";
import i18n from "../../../../../i18n";
import renderCardHeader from "../../../../../common/components/CardHeader";
import Constants from 'expo-constants';
import CardListContainer from "../../../../../common/components/CardListContainer";
import DatabaseService from "../../../../../services/database/DatabaseService";
import * as Updates from 'expo-updates';
import DrawerAction from "../../../../../common/components/DrawerAction";
import ImageRepository from "../../../../../repositories/ImageRepository";
import LoadingContainer from "../../../../../common/components/LoadingContainer";
import * as Application from 'expo-application';
import ReferencePlantsService from "../../../../../services/ReferencePlantsService";

export default () => {

    const navigation = useNavigation<DeveloperStackNavigationProp<DeveloperStackRoute.DEVELOPER_OVERVIEW>>();
    const route = useRoute<DeveloperStackRouteProp<DeveloperStackRoute.DEVELOPER_OVERVIEW>>();

    const [waiting, setWaiting] = useState(false);
    const [referenceDatabaseSize, setReferenceDatabaseSize] = useState(ReferencePlantsService.getDatabaseSize());

    async function fetchAndApplyOTAUpdate() {
        try {
            setWaiting(true);
            await Updates.fetchUpdateAsync();
            Updates.reloadAsync();
        } finally {
            setWaiting(false);
        }
    }

    async function checkForOTAUpdate() {
        try {
            setWaiting(true);
            const result = await Updates.checkForUpdateAsync();
            if (result.isAvailable) {
                Alert.alert(
                    'OTA Aktualisierung',
                    `Version ${result.manifest!.runtimeVersion} ist verfügbar`,
                    [
                        {
                            text: 'Jetzt übernehmen',
                            onPress: () => fetchAndApplyOTAUpdate()
                        },
                        {text: 'Ignorieren'}
                    ]
                );
            } else {
                Alert.alert(
                    'OTA Aktualisierung',
                    `Version ${Constants.manifest2!.runtimeVersion} ist die aktuellste Version`,
                    [{text: 'OK'}]
                );
            }
        } finally {
            setWaiting(false);
        }
    }

    async function compressAllImages() {
        try {
            setWaiting(true);
            await ImageRepository.compressAllImages();
        } finally {
            setWaiting(false);
        }
    }

    async function updateReferenceDatabase() {
        try {
            setWaiting(true);
            await ReferencePlantsService.updateAndLoadDatabase();
            setReferenceDatabaseSize(ReferencePlantsService.getDatabaseSize())
        } finally {
            setWaiting(false);
        }
    }

    function renderVersionItem({item}: ListRenderItemInfo<any>) {
        return (
            <ListItem title={item.value} description={item.key} disabled={true}/>
        )
    }

    const versions = [
        {
            key: 'App Version',
            value: Constants.manifest!.version
        },
        {
            key: 'Native App Version',
            value: Application.nativeApplicationVersion
        }
    ]


    const VersionsFooter = (props: any) => (
        <View {...props}>
            <Button onPress={checkForOTAUpdate}>
                Auf OTA Aktualisierungen prüfen
            </Button>
        </View>
    )

    const ReferenceDatabaseFooter = (props: any) => (
        <View {...props}>
            <Button onPress={updateReferenceDatabase}>
                Aktualisieren
            </Button>
        </View>
    )

    return (
        <LoadingContainer loading={waiting}>
            <TopNavigation title={TopNavigationTitle(i18n.t('DEVELOPER'))}
                           alignment="center"
                           accessoryLeft={DrawerAction}/>
            <Divider/>
            <Layout style={styles.layout} level="2">
                <Card header={renderCardHeader('App Version')} style={styles.card} footer={VersionsFooter}>
                    <CardListContainer>
                        <List data={versions} renderItem={renderVersionItem}
                              ItemSeparatorComponent={Divider}/>
                    </CardListContainer>
                </Card>
                <Card header={renderCardHeader('Referenz-Datenbank')} style={styles.card}
                      footer={ReferenceDatabaseFooter}>
                    <CardListContainer>
                        <ListItem title={referenceDatabaseSize} description={'Einträge'}
                                  disabled={true}/>
                    </CardListContainer>
                </Card>
                <Card header={renderCardHeader('Bilder')} style={styles.card}>
                    <Button onPress={() => compressAllImages()} status="warning">
                        Bilder optimieren
                    </Button>
                </Card>
                <Card header={renderCardHeader('Danger zone')}>
                    <Button onPress={() => DatabaseService.resetDatabase()} status="danger">
                        Datenbank zurücksetzen
                    </Button>
                </Card>
            </Layout>
            <Divider/>
        </LoadingContainer>
    )

}

const styles = StyleSheet.create({
    layout: {
        flex: 1,
        padding: 15
    },
    card: {
        marginBottom: 15
    },
});