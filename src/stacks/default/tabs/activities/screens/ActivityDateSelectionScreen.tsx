import {useNavigation, useRoute} from "@react-navigation/native";
import {Button, Card, Datepicker, Divider, Icon, Layout, TopNavigation} from "@ui-kitten/components";
import React, {useState} from "react";
import {StyleSheet} from "react-native";
import renderTopNavigationTitle from "../../../../../common/components/renderTopNavigationTitle";
import {ActivitiesStackNavigationProp, ActivitiesStackRoute, ActivitiesStackRouteProp} from "../ActivitiesStackRoute";
import ObjectUtils, {MIN_DATE} from "../../../../../common/ObjectUtils";
import renderCancelAction from "../../../../../common/components/renderCancelAction";

export default () => {

    const navigation = useNavigation<ActivitiesStackNavigationProp<ActivitiesStackRoute.ACTIVITY_DATE_SELECTION>>();
    const route = useRoute<ActivitiesStackRouteProp<ActivitiesStackRoute.ACTIVITY_DATE_SELECTION>>();

    const [activityDate, setActivityDate] = useState<Date>(new Date());

    const nextStep = () => {
        const activityType = route.params.activityType;
        navigation.navigate({
            name: ActivitiesStackRoute.ACTIVITY_PLANT_SELECTION,
            params: {
                activityType,
                activityDate: activityDate!.toISOString()
            }
        });
    }

    const CalendarIcon = (props: any) => (
        <Icon {...props} name='calendar'/>
    );

    return (
        <React.Fragment>
            <TopNavigation title={renderTopNavigationTitle("Datum wählen")}
                           alignment="center"
                           accessoryLeft={renderCancelAction()}/>
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
                        disabled={!ObjectUtils.isDefined(activityDate)}>
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