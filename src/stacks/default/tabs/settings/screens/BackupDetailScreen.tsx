import {Button, Divider, Icon, Layout, TopNavigation, TopNavigationAction} from "@ui-kitten/components";
import React, {useState} from "react";
import {StyleSheet} from "react-native";
import {useNavigation, useRoute} from "@react-navigation/native";
import renderTopNavigationTitle from "../../../../../common/components/renderTopNavigationTitle";
import {SettingsTabNavigationProp, SettingsTabRoute, SettingsTabRouteProp} from "../SettingsTabRoute";
import BackupService from "../../../../../services/BackupService";
import * as Sharing from 'expo-sharing';

export default () => {

    const navigation = useNavigation<SettingsTabNavigationProp<SettingsTabRoute.SETTINGS_BACKUP_DETAIL>>();
    const route = useRoute<SettingsTabRouteProp<SettingsTabRoute.SETTINGS_BACKUP_DETAIL>>();

    const [backup] = useState(route.params.backup)

    const back = () => {
        navigation.goBack();
    }

    const shareBackup = async () => {
        await Sharing.shareAsync(backup.uri, {
            mimeType: 'application/zip',
            UTI: 'public.zip-archive'
        });
    }

    const deleteBackup = async () => {
        await BackupService.deleteBackup(backup);
        navigation.goBack();
    }

    const applyBackup = async () => {
        await BackupService.applyBackup(backup);
    }

    const BackIcon = (props: any) => (
        <Icon {...props} name='arrow-back'/>
    );

    const BackAction = () => (
        <TopNavigationAction icon={BackIcon} onPress={back}/>
    );

    return (
        <React.Fragment>
            <TopNavigation title={renderTopNavigationTitle(backup.name)}
                           alignment="center"
                           accessoryLeft={BackAction}/>
            <Divider/>
            <Layout style={styles.layout} level="2">
                <Button onPress={shareBackup}>Teilen</Button>
                <Button status="danger" style={styles.button} onPress={applyBackup}>Übernehmen</Button>
                <Button status="danger" style={styles.button} onPress={deleteBackup}>Löschen</Button>
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
    button: {
        marginTop: 15
    }
});