import {useNavigation, useRoute} from "@react-navigation/native";
import {Button, Card, Datepicker, Divider, Icon, Layout, Text, TopNavigation} from "@ui-kitten/components";
import React, {useState} from "react";
import {StyleSheet} from "react-native";
import i18n from "../../../../../i18n";
import renderTopNavigationTitle from "../../../../../common/components/renderTopNavigationTitle";
import {ActivitiesStackNavigationProp, ActivitiesStackRouteProp, ActivitiesTabRoute} from "../ActivitiesTabRoute";
import ObjectUtils, {MIN_DATE} from "../../../../../common/ObjectUtils";

export default () => {

    const navigation = useNavigation<ActivitiesStackNavigationProp<ActivitiesTabRoute.ACTIVITY_DATE_SELECTION>>();
    const route = useRoute<ActivitiesStackRouteProp<ActivitiesTabRoute.ACTIVITY_DATE_SELECTION>>();

    const [activityDate, setActivityDate] = useState<Date>();

    const nextStep = () => {
        const activityTypes = route.params.activityTypes;
        navigation.navigate({
            name: ActivitiesTabRoute.ACTIVITY_PLANT_SELECTION,
            params: {
                activityTypes,
                activityDate: activityDate!.toISOString()
            }
        });
    }

    const CalendarIcon = (props: any) => (
        <Icon {...props} name='calendar'/>
    );

    return (
        <React.Fragment>
            <TopNavigation title={renderTopNavigationTitle(i18n.t('ACTIVITIES'))}
                           alignment="center"/>
            <Divider/>
            <Layout style={styles.layout} level="2">
                <Card status="basic">
                    <Text category="s1" style={styles.text}>
                        Welches Datum möchtest du für diese Aktivitäten setzen?
                    </Text>
                    <Datepicker
                        style={styles.datePicker}
                        date={activityDate}
                        min={MIN_DATE}
                        onSelect={date => setActivityDate(date)}
                        accessoryRight={CalendarIcon}
                    />
                    <Button onPress={nextStep}
                            disabled={!ObjectUtils.isDefined(activityDate)}
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
    datePicker: {
        marginTop: 15
    },
    button: {
        marginTop: 15
    }
});