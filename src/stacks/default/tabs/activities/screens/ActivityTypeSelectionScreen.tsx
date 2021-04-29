import {useNavigation, useRoute} from "@react-navigation/native";
import {Button, Card, CheckBox, Divider, Layout, Text, TopNavigation} from "@ui-kitten/components";
import React, {useState} from "react";
import {StyleSheet} from "react-native";
import {ActivitiesStackNavigationProp, ActivitiesStackRouteProp, ActivitiesTabRoute} from "../ActivitiesTabRoute";
import i18n, {translateEnumValue} from "../../../../../i18n";
import renderTopNavigationTitle from "../../../../../common/components/renderTopNavigationTitle";
import {ActivityType} from "../../../../../model/ActivityType";
import ObjectUtils from "../../../../../common/ObjectUtils";

export default () => {

    const navigation = useNavigation<ActivitiesStackNavigationProp<ActivitiesTabRoute.ACTIVITY_TYPE_SELECTION>>();
    const route = useRoute<ActivitiesStackRouteProp<ActivitiesTabRoute.ACTIVITY_TYPE_SELECTION>>();

    const [selectedActivityTypes, setSelectedActivityTypes] = useState<ActivityType[]>([]);

    const selectActivityType = (shouldBeSelected: boolean, activityType: ActivityType) => {
        if (shouldBeSelected) {
            if (!isActivityTypeSelected(activityType)) {
                selectedActivityTypes.push(activityType);
            }
        } else {
            if (isActivityTypeSelected(activityType)) {
                const index = selectedActivityTypes.indexOf(activityType);
                selectedActivityTypes.splice(index, 1);
            }
        }

        // force render by cloning array
        setSelectedActivityTypes(selectedActivityTypes.slice());
    }

    const isActivityTypeSelected = (activityType: ActivityType) => {
        return selectedActivityTypes.indexOf(activityType) !== -1;
    }

    const nextStep = () => {
        navigation.navigate({
            name: ActivitiesTabRoute.ACTIVITY_DATE_SELECTION,
            params: {activityTypes: selectedActivityTypes}
        });
    }

    const renderActivityOptions = () => {
        return ObjectUtils
            .enumValues<ActivityType>(ActivityType)
            .map((activityType) => (
                <CheckBox checked={isActivityTypeSelected(activityType)}
                          onChange={(selected) => selectActivityType(selected, activityType)}
                          key={activityType}
                          style={styles.checkbox}>
                    {translateEnumValue(activityType, ActivityType)}
                </CheckBox>
            ));
    }

    return (
        <React.Fragment>
            <TopNavigation title={renderTopNavigationTitle(i18n.t('ACTIVITIES'))}
                           alignment="center"/>
            <Divider/>
            <Layout style={styles.layout} level="2">
                <Card status="basic">
                    <Text category="s1" style={styles.text}>
                        Welche Aktivitäten möchtest du bei deinen Pflanzen aktualisieren?
                    </Text>
                    {renderActivityOptions()}
                    <Button onPress={nextStep}
                            disabled={selectedActivityTypes.length === 0}
                            style={styles.button}>
                        Weiter
                    </Button>
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
    text: {
        textAlign: "center"
    },
    checkbox: {
        marginTop: 15
    },
    button: {
        marginTop: 15
    }
});