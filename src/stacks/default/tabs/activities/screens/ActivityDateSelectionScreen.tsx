import {useNavigation, useRoute} from "@react-navigation/native";
import {Button, Card, Datepicker, Divider, Icon, Layout, TopNavigation} from "@ui-kitten/components";
import React, {useState} from "react";
import {StyleSheet} from "react-native";
import {ActivitiesStackNavigationProp, ActivitiesStackRoute, ActivitiesStackRouteProp} from "../ActivitiesStackRoute";
import {isDefined, MIN_DATE} from "../../../../../common/Utils";
import {CalendarIcon} from "../../../../../common/components/Icons";
import TopNavigationTitle from "../../../../../common/components/TopNavigationTitle";
import CancelAction from "../../../../../common/components/CancelAction";

export default () => {

    const navigation = useNavigation<ActivitiesStackNavigationProp<ActivitiesStackRoute.ACTIVITY_DATE_SELECTION>>();
    const route = useRoute<ActivitiesStackRouteProp<ActivitiesStackRoute.ACTIVITY_DATE_SELECTION>>();

    const [activityDate, setActivityDate] = useState<Date>(new Date());

    function nextStep() {
        const activityType = route.params.activityType;
        navigation.navigate({
            name: ActivitiesStackRoute.ACTIVITY_PLANT_SELECTION,
            params: {
                activityType,
                activityDate: activityDate!.toISOString()
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
                    <Datepicker
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