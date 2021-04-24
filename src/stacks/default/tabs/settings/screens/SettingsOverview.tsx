import React from "react";
import {Divider, Layout, List, ListItem, TopNavigation} from "@ui-kitten/components";
import {ListRenderItemInfo} from "react-native";
import GrowBuddyDatabaseService from "../../../../../services/database/GrowBuddyDatabaseService";
import renderTopNavigationTitle from "../../../../../common/components/renderTopNavigationTitle";
import {useNavigation, useRoute} from "@react-navigation/native";
import {SettingsTabNavigationProp, SettingsTabRoute, SettingsTabRouteProp} from "../SettingsTabRoute";
import i18n from "../../../../../i18n";

export default () => {

    const navigation = useNavigation<SettingsTabNavigationProp<SettingsTabRoute.SETTINGS_OVERVIEW>>();
    const route = useRoute<SettingsTabRouteProp<SettingsTabRoute.SETTINGS_OVERVIEW>>();

    const settings = [
        {
            title: i18n.t('BACKUPS'),
            onPress: async () => {
                navigation.navigate({name: SettingsTabRoute.SETTINGS_BACKUP_OVERVIEW, params: {}});
            }
        }, {
            title: 'Datenbank zurücksetzen',
            onPress: async () => {
                await GrowBuddyDatabaseService.resetDatabase();
            }
        }
    ]

    const renderItem = ({item}: ListRenderItemInfo<any>) => {
        return (
            <ListItem title={item.title} description={item.description} onPress={item.onPress}/>
        )
    }

    return (
        <React.Fragment>
            <TopNavigation title={renderTopNavigationTitle("Settings")} alignment="center"/>
            <Divider/>
            <Layout style={{flex: 1}}>
                <List
                    data={settings}
                    renderItem={renderItem}
                    ItemSeparatorComponent={Divider}
                />
            </Layout>
            <Divider/>
        </React.Fragment>
    )

};