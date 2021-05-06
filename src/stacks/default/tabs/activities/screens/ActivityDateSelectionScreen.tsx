import {useNavigation, useRoute} from "@react-navigation/native";
import {Button, Card, Divider, Layout, TopNavigation} from "@ui-kitten/components";
import React, {useState} from "react";
import {StyleSheet} from "react-native";
import {ActivitiesStackNavigationProp, ActivitiesStackRoute, ActivitiesStackRouteProp} from "../ActivitiesStackRoute";
import {formatAsIsoString, isDefined, MIN_DATE} from "../../../../../common/Utils";
import {CalendarIcon} from "../../../../../common/components/Icons";
import TopNavigationTitle from "../../../../../common/components/TopNavigationTitle";
import CancelAction from "../../../../../common/components/CancelAction";
import moment, {Moment} from "moment";
import MomentBackedDatepicker from "../../../../../common/components/MomentBackedDatepicker";

export default () => {

    const navigation = useNavigation<ActivitiesStackNavigationProp<ActivitiesStackRoute.ACTIVITY_DATE_SELECTION>>();
    const route = useRoute<ActivitiesStackRouteProp<ActivitiesStackRoute.ACTIVITY_DATE_SELECTION>>();

    const [activityDate, setActivityDate] = useState<Moment>(moment());

    function nextStep() {
        const activityType = route.params.activityType;
        navigation.navigate({
            name: ActivitiesStackRoute.ACTIVITY_PLANT_SELECTION,
            params: {
                activityType,
                activityDate: formatAsIsoString(activityDate)!
            }
        });
    }

    return (
        <React.Fragment>
            <TopNavigation title={TopNavigationTitle("Datum wählen")}
                           alignment="center"
                           accessoryLeft={CancelAction()}/>
            <Divider/>
            <Layout style={styles.layout} level="2">
                <Card status="basic">
                    <MomentBackedDatepicker
                        date={activityDate}
                        min={MIN_DATE}
                        onSelect={date => setActivityDate(date)}
                        accessoryRight={CalendarIcon}
                    />
                </Card>
            </Layout>
            <Divider/>
            <Layout style={styles.buttonContainer}>
                <Button onPress={nextStep}
                        disabled={!isDefined(activityDate)}>
                    Weiter
                </Button>
            </Layout>
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
    button: {
        marginTop: 15
    },
    buttonContainer: {
        padding: 15
    }
});