import {Button, Divider, Layout, TopNavigation} from "@ui-kitten/components";
import renderTopNavigationTitle from "../../../../../common/components/renderTopNavigationTitle";
import i18n, {translateEnumValue} from "../../../../../i18n";
import DrawerAction from "../../../../../common/components/DrawerAction";
import React from "react";
import {StyleSheet} from "react-native";
import {useNavigation, useRoute} from "@react-navigation/native";
import {ActivitiesStackNavigationProp, ActivitiesStackRoute, ActivitiesStackRouteProp} from "../ActivitiesStackRoute";
import ObjectUtils from "../../../../../common/ObjectUtils";
import {ActivityType} from "../../../../../model/ActivityType";

export default () => {

    const navigation = useNavigation<ActivitiesStackNavigationProp<ActivitiesStackRoute.ACTIVITIES_OVERVIEW>>();
    const route = useRoute<ActivitiesStackRouteProp<ActivitiesStackRoute.ACTIVITIES_OVERVIEW>>();

    const executeActivity = (activityType: ActivityType) => {
        navigation.navigate({
            name: ActivitiesStackRoute.ACTIVITY_DATE_SELECTION,
            params: {activityType}
        });
    }

    const renderActivityButtons = () => {
        return ObjectUtils
            .enumValues<ActivityType>(ActivityType)
            .map((activityType) => (
                <Button onPress={() => executeActivity(activityType)}
                        key={activityType}
                        appearance="outline"
                        style={styles.button}>
                    {translateEnumValue(activityType, ActivityType)}
                </Button>
            ));
    }

    return (
        <React.Fragment>
            <TopNavigation title={renderTopNavigationTitle(i18n.t('ACTIVITIES'))}
                           alignment="center"
                           accessoryLeft={DrawerAction}/>
            <Divider/>
            <Layout style={styles.layout}>
                {renderActivityButtons()}
            </Layout>
            <Divider/>
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    layout: {
        flex: 1
    },
    button: {
        margin: 15,
        marginBottom: 0
    }
});