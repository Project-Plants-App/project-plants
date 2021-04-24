import {StackActions, useNavigation, useRoute} from "@react-navigation/native";
import React, {useState} from "react";
import {useOnFocusOnceEffect} from "../../../../../common/hooks/Hooks";
import {Alert, ListRenderItemInfo, StyleSheet} from "react-native";
import BackupService, {Backup} from "../../../../../services/BackupService";
import {Divider, Icon, Layout, List, ListItem, TopNavigation, TopNavigationAction} from "@ui-kitten/components";
import renderTopNavigationTitle from "../../../../../common/components/renderTopNavigationTitle";
import i18n from "../../../../../i18n";
import * as DocumentPicker from 'expo-document-picker';
import {SettingsTabNavigationProp, SettingsTabRoute, SettingsTabRouteProp} from "../SettingsTabRoute";


export default () => {

    const navigation = useNavigation<SettingsTabNavigationProp<SettingsTabRoute.SETTINGS_BACKUP_OVERVIEW>>();
    const route = useRoute<SettingsTabRouteProp<SettingsTabRoute.SETTINGS_BACKUP_OVERVIEW>>();

    const [backups, setBackups] = useState<Backup[]>();

    const reload = () => {
        BackupService.getAllBackups().then((backups) => {
            setBackups(backups);
        });
    }

    const back = () => {
        navigation.dispatch(StackActions.popToTop());
    }

    const BackIcon = (props: any) => (
        <Icon {...props} name='arrow-back'/>
    );

    const BackAction = () => (
        <TopNavigationAction icon={BackIcon} onPress={back}/>
    );

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
        navigation.navigate({name: SettingsTabRoute.SETTINGS_BACKUP_DETAIL, params: {backup}});
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
                           accessoryLeft={BackAction}
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