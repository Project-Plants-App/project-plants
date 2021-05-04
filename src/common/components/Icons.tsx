import {Icon, IconProps} from "@ui-kitten/components";
import React from "react";

function createIconCallback(icon: string) {
    return (props: IconProps) => (
        <Icon {...props} name={icon}/>
    );
}

export const DrawerIcon = createIconCallback("menu-outline");
export const BackIcon = createIconCallback("arrow-back");
export const CancelIcon = createIconCallback("close-outline");
export const SettingsIcon = createIconCallback("plus-outline");
export const EditIcon = createIconCallback("edit-outline");
export const LinkIcon = createIconCallback("external-link-outline");
export const SaveIcon = createIconCallback("save-outline");
export const CameraIcon = createIconCallback("camera-outline");
export const MediaLibraryIcon = createIconCallback("image-outline");
export const CalendarIcon = createIconCallback("calendar");
export const PlantsIcon = createIconCallback("list-outline");
export const ActivitiesIcon = createIconCallback("checkmark-circle-outline");
export const BackupsIcon = createIconCallback("save-outline");
export const DeveloperIcon = createIconCallback("bulb-outline");