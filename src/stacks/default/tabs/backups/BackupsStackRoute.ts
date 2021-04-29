import {RouteProp} from "@react-navigation/native";
import {StackNavigationProp} from "@react-navigation/stack";
import {Backup} from "../../../../services/BackupService";

export enum BackupsStackRoute {
    BACKUPS = 'backups',
    BACKUPS_OVERVIEW = 'backups-overview',
    BACKUPS_DETAIL = 'backups-detail',
}

export type BackupsStackRouteParams = {
    "backups-overview": any;
    "backups-detail": {
        backup: Backup
    }
}

export type BackupsStackRouteProp<RouteName extends keyof BackupsStackRouteParams> = RouteProp<BackupsStackRouteParams, RouteName>;

export type BackupsStackNavigationProp<RouteName extends keyof BackupsStackRouteParams> = StackNavigationProp<BackupsStackRouteParams, RouteName>;
