import React from "react";
import {Divider, Icon, Layout, Menu, MenuItem, TopNavigation} from "@ui-kitten/components";
import GrowBuddyDatabaseService from "../../../../../services/database/GrowBuddyDatabaseService";
import renderTopNavigationTitle from "../../../../../common/components/renderTopNavigationTitle";
import {useNavigation, useRoute} from "@react-navigation/native";
import {SettingsTabNavigationProp, SettingsTabRoute, SettingsTabRouteProp} from "../SettingsTabRoute";
import i18n from "../../../../../i18n";

export default () => {

    const navigation = useNavigation<SettingsTabNavigationProp<SettingsTabRoute.SETTINGS_OVERVIEW>>();
    const route = useRoute<SettingsTabRouteProp<SettingsTabRoute.SETTINGS_OVERVIEW>>();

    const ForwardIcon = (props: any) => (
        <Icon {...props} name='arrow-ios-forward'/>
    );

    return (
        <React.Fragment>
            <TopNavigation title={renderTopNavigationTitle("Settings")} alignment="center"/>
            <Divider/>
            <Layout style={{flex: 1}}>
                <Menu>
                    <MenuItem
                        title={i18n.t('BACKUPS')}
                        onPress={() => navigation.navigate({
                            name: SettingsTabRoute.SETTINGS_BACKUP_OVERVIEW,
                            params: {}
                        })}
                        accessoryRight={ForwardIcon}
                    />
                    <MenuItem
                        title={i18n.t('DEVELOPER')}
                        onPress={() => navigation.navigate({
                            name: SettingsTabRoute.SETTINGS_DEVELOPER,
                            params: {}
                        })}
                        accessoryRight={ForwardIcon}
                    />
                </Menu>
            </Layout>
            <Divider/>
        </React.Fragment>
    )

};