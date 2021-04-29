import {
    Button,
    Card,
    Divider,
    Icon,
    Layout,
    List,
    ListItem,
    TopNavigation,
    TopNavigationAction
} from "@ui-kitten/components";
import React, {useState} from "react";
import {Alert, ListRenderItemInfo, StyleSheet, View} from "react-native";
import {useNavigation, useRoute} from "@react-navigation/native";
import renderTopNavigationTitle from "../../../../../common/components/renderTopNavigationTitle";
import {DeveloperStackNavigationProp, DeveloperStackRoute, DeveloperStackRouteProp} from "../DeveloperStackRoute";
import i18n from "../../../../../i18n";
import renderCardHeader from "../../../../../common/components/renderCardHeader";
import Constants from 'expo-constants';
import CardListContainer from "../../../../../common/components/CardListContainer";
import GrowBuddyDatabaseService from "../../../../../services/database/GrowBuddyDatabaseService";
import * as Updates from 'expo-updates';
import renderBackAction from "../../../../../common/components/renderBackAction";
import DrawerAction from "../../../../../common/components/DrawerAction";

export default () => {

    const navigation = useNavigation<DeveloperStackNavigationProp<DeveloperStackRoute.DEVELOPER_OVERVIEW>>();
    const route = useRoute<DeveloperStackRouteProp<DeveloperStackRoute.DEVELOPER_OVERVIEW>>();

    const checkForOTAUpdate = () => {
        Updates.checkForUpdateAsync().then((result) => {
            if (result.isAvailable) {
                Alert.alert(
                    'OTA Aktualisierung',
                    `Version ${result.manifest.version} ist verfügbar`,
                    [
                        {
                            text: 'Jetzt übernehmen',
                            onPress: () => {
                                Updates.fetchUpdateAsync().then(() => {
                                    Updates.reloadAsync();
                                });
                            }
                        },
                        {text: 'Ignorieren'}
                    ]
                );
            } else {
                Alert.alert(
                    'OTA Aktualisierung',
                    `Version ${Constants.manifest.version} ist die aktuellste Version`,
                    [{text: 'OK'}]
                );
            }
        });
    }

    const versions = [
        {
            key: 'App Version',
            value: Constants.manifest.version
        },
        {
            key: 'Native App Version',
            value: Constants.nativeAppVersion
        }
    ]

    const renderVersionItem = ({item}: ListRenderItemInfo<any>) => {
        return (
            <ListItem title={item.value} description={item.key} disabled={true}/>
        )
    }

    const Footer = (props: any) => (
        <View {...props}>
            <Button onPress={checkForOTAUpdate}>
                Auf OTA Aktualisierungen prüfen
            </Button>
        </View>
    )

    return (
        <React.Fragment>
            <TopNavigation title={renderTopNavigationTitle(i18n.t('DEVELOPER'))}
                           alignment="center"
                           accessoryLeft={DrawerAction}/>
            <Divider/>
            <Layout style={styles.layout} level="2">
                <Card header={renderCardHeader('App Version')} style={styles.card} footer={Footer}>
                    <CardListContainer>
                        <List data={versions} renderItem={renderVersionItem}
                              ItemSeparatorComponent={Divider}/>
                    </CardListContainer>
                </Card>
                <Card header={renderCardHeader('Danger zone')}>
                    <Button onPress={() => GrowBuddyDatabaseService.resetDatabase()} status="danger">
                        Datenbank zurücksetzen
                    </Button>
                </Card>
            </Layout>
            <Divider/>
        </React.Fragment>
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