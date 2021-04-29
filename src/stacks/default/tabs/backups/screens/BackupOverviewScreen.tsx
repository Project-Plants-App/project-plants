import {useNavigation, useRoute} from "@react-navigation/native";
import React, {useState} from "react";
import {useOnFocusOnceEffect} from "../../../../../common/hooks/Hooks";
import {Alert, ListRenderItemInfo, StyleSheet} from "react-native";
import BackupService, {Backup} from "../../../../../services/BackupService";
import {Divider, Icon, Layout, List, ListItem, TopNavigation, TopNavigationAction} from "@ui-kitten/components";
import renderTopNavigationTitle from "../../../../../common/components/renderTopNavigationTitle";
import i18n from "../../../../../i18n";
import * as DocumentPicker from 'expo-document-picker';
import {BackupsStackNavigationProp, BackupsStackRoute, BackupsStackRouteProp} from "../BackupsStackRoute";
import DrawerAction from "../../../../../common/components/DrawerAction";

export default () => {

    const navigation = useNavigation<BackupsStackNavigationProp<BackupsStackRoute.BACKUPS_OVERVIEW>>();
    const route = useRoute<BackupsStackRouteProp<BackupsStackRoute.BACKUPS_OVERVIEW>>();

    const [backups, setBackups] = useState<Backup[]>();

    const reload = () => {
        BackupService.getAllBackups().then((backups) => {
            setBackups(backups);
        });
    }

    const showBackupCreationAlert = () => {
        Alert.alert('Sicherungskopie hinzufügen', undefined, [
            {
                text: 'Erstellen',
                onPress: createBackup
            },
            {
                text: 'Importieren',
                onPress: addBackup
            },
            {
                text: 'Abbrechen'
            }
        ]);
    }

    const openBackupDetail = (backup: Backup) => {
        navigation.navigate({name: BackupsStackRoute.BACKUPS_DETAIL, params: {backup}});
    }

    const createBackup = async () => {
        await BackupService.createBackup();
        reload();
    }

    const addBackup = async () => {
        const result = await DocumentPicker.getDocumentAsync({type: 'application/zip'});
        if (result.type === 'success') {
            await BackupService.addBackup(result.name, result.uri);
            reload();
        }
    }

    useOnFocusOnceEffect(() => {
        reload()
    });

    const SettingsIcon = (props: any) => (
        <Icon {...props} name="plus-outline"/>
    );

    const CreateAction = () => (
        <TopNavigationAction icon={SettingsIcon} onPress={() => showBackupCreationAlert()}/>
    );

    const renderItem = ({item}: ListRenderItemInfo<Backup>) => {
        return (
            <ListItem title={item.name} description={item.creationDate} onPress={() => openBackupDetail(item)}/>
        )
    }

    return (
        <React.Fragment>
            <TopNavigation title={renderTopNavigationTitle(i18n.t('BACKUPS'))}
                           alignment="center"
                           accessoryLeft={DrawerAction}
                           accessoryRight={CreateAction}/>
            <Divider/>
            <Layout style={styles.layout}>
                <List data={backups} renderItem={renderItem} style={styles.list} ItemSeparatorComponent={Divider}/>
            </Layout>
            <Divider/>
        </React.Fragment>
    )

}

const styles = StyleSheet.create({
    layout: {
        flex: 1
    },
    list: {
        flex: 1,
    }
});