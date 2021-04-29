import {Button, Card, Divider, Layout, TopNavigation} from "@ui-kitten/components";
import React, {useState} from "react";
import {StyleSheet} from "react-native";
import {useNavigation, useRoute} from "@react-navigation/native";
import renderTopNavigationTitle from "../../../../../common/components/renderTopNavigationTitle";
import {BackupsStackNavigationProp, BackupsStackRoute, BackupsStackRouteProp} from "../BackupsStackRoute";
import BackupService from "../../../../../services/BackupService";
import * as Sharing from 'expo-sharing';
import renderBackAction from "../../../../../common/components/renderBackAction";

export default () => {

    const navigation = useNavigation<BackupsStackNavigationProp<BackupsStackRoute.BACKUPS_DETAIL>>();
    const route = useRoute<BackupsStackRouteProp<BackupsStackRoute.BACKUPS_DETAIL>>();

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

    return (
        <React.Fragment>
            <TopNavigation title={renderTopNavigationTitle(backup.name)}
                           alignment="center"
                           accessoryLeft={renderBackAction()}/>
            <Divider/>
            <Layout style={styles.layout} level="2">
                <Card status="basic">
                    <Button onPress={shareBackup}>Teilen</Button>
                    <Button status="danger" style={styles.button} onPress={applyBackup}>Übernehmen</Button>
                    <Button status="danger" style={styles.button} onPress={deleteBackup}>Löschen</Button>
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
    button: {
        marginTop: 15
    }
});