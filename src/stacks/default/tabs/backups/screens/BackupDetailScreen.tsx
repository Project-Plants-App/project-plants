import {Button, Card, Divider, Layout, TopNavigation} from "@ui-kitten/components";
import React, {useState} from "react";
import {StyleSheet} from "react-native";
import {useNavigation, useRoute} from "@react-navigation/native";
import TopNavigationTitle from "../../../../../common/components/TopNavigationTitle";
import {BackupsStackNavigationProp, BackupsStackRoute, BackupsStackRouteProp} from "../BackupsStackRoute";
import BackupService from "../../../../../services/BackupService";
import * as Sharing from 'expo-sharing';
import BackAction from "../../../../../common/components/BackAction";
import LoadingContainer from "../../../../../common/components/LoadingContainer";

export default () => {

    const navigation = useNavigation<BackupsStackNavigationProp<BackupsStackRoute.BACKUPS_DETAIL>>();
    const route = useRoute<BackupsStackRouteProp<BackupsStackRoute.BACKUPS_DETAIL>>();

    const [backup] = useState(route.params.backup)
    const [waiting, setWaiting] = useState(false);

    async function shareBackup() {
        await Sharing.shareAsync(backup.uri, {
            mimeType: 'application/zip',
            UTI: 'public.zip-archive'
        });
    }

    async function deleteBackup() {
        await BackupService.deleteBackup(backup);
        navigation.goBack();
    }

    async function applyBackup() {
        try {
            setWaiting(true);
            await BackupService.applyBackup(backup);
        } finally {
            setWaiting(false);
        }
    }

    return (
        <LoadingContainer loading={waiting}>
            <TopNavigation title={TopNavigationTitle(backup.name)}
                           alignment="center"
                           accessoryLeft={BackAction()}/>
            <Divider/>
            <Layout style={styles.layout} level="2">
                <Card status="basic">
                    <Button onPress={shareBackup}>Teilen</Button>
                    <Button status="danger" style={styles.button} onPress={applyBackup}>Übernehmen</Button>
                    <Button status="danger" style={styles.button} onPress={deleteBackup}>Löschen</Button>
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
    button: {
        marginTop: 15
    }
});