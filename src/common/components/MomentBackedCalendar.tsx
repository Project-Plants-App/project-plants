import React from "react";
import {Calendar, CalendarProps} from "@ui-kitten/components";
import {Moment} from "moment";
import {dateService} from "../../i18n";

type MomentBackedCalendarProps = Omit<CalendarProps<Moment>, 'dateService'>;

export default (props: MomentBackedCalendarProps) => <Calendar {...props} dateService={dateService}/>