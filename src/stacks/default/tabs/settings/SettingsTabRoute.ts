import {RouteProp} from "@react-navigation/native";
import {StackNavigationProp} from "@react-navigation/stack";
import {Backup} from "../../../../services/BackupService";

export enum SettingsTabRoute {
    SETTINGS = 'settings',
    SETTINGS_OVERVIEW = 'settings-overview',
    SETTINGS_BACKUP_OVERVIEW = 'settings-backup-overview',
    SETTINGS_BACKUP_DETAIL = 'settings-backup-detail',
    SETTINGS_DEVELOPER = 'settings-developer'
}

export type SettingsTabRouteParams = {
    "settings-overview": any;
    "settings-backup-overview": any;
    "settings-backup-detail": {
        backup: Backup
    },
    "settings-developer": any;
}

export type SettingsTabRouteProp<RouteName extends keyof SettingsTabRouteParams> = RouteProp<SettingsTabRouteParams, RouteName>;

export type SettingsTabNavigationProp<RouteName extends keyof SettingsTabRouteParams> = StackNavigationProp<SettingsTabRouteParams, RouteName>;
