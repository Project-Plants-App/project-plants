import React from "react";
import {Datepicker} from "@ui-kitten/components";
import {Moment} from "moment";
import {DatepickerProps} from "@ui-kitten/components/ui/datepicker/datepicker.component";
import {dateService} from "../../i18n";

type MomentBackedDatepickerProps = Omit<DatepickerProps<Moment>, 'dateService'>;

export default (props: MomentBackedDatepickerProps) => <Datepicker {...props} dateService={dateService}/>