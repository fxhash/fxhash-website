import React, { memo, useState } from 'react';
import { Spacing } from "../../components/Layout/Spacing";
import cs from "classnames";
import style from "./Planning.module.scss";
import { Field } from "../../components/Form/Field";
import { IOptions, Select } from "../../components/Input/Select";
import { getLocalTimezone, timezones, timezoneSearchKeys } from "../../utils/timzones";
import { InputText } from "../../components/Input/InputText";
import { Schedule } from "../Community/Schedule";
import { TimeZone } from "@vvo/tzdb";

const optionsTimezones: IOptions[] = timezones.map(timezone => ({
  label: timezone.currentTimeFormat,
  value: timezone.name
}))

const _Planning = () => {
  const [timezone, setTimezone] = useState<TimeZone>(getLocalTimezone())
  const updateTimezone = (value: string) => setTimezone(timezones.find(tz => tz.name === value)!)
  const [nbDays, setNbDays] = useState<number>(7)

  return (
    <>
      <h4>Planning</h4>
      <Spacing size="small"/>
      <div className={cs(style.selects)}>
        <Field className={cs(style.select_timezone)}>
          <label>Timezone</label>
          <Select
            className={style.select}
            value={timezone?.name}
            options={optionsTimezones}
            onChange={updateTimezone}
            search={true}
            searchKeys={timezoneSearchKeys}
            searchDictionnary={timezones}
            searchValue="name"
          />
        </Field>
        <Field className={cs(style.input_days_wrapper)}>
          <label>Number of days</label>
          <InputText
            type="number"
            value={nbDays}
            onChange={evt => setNbDays(parseInt(evt.target.value))}
          />
        </Field>
      </div>
      <Spacing size="large"/>
      <Schedule
        timezone={timezone}
        nbDays={nbDays}
      />
    </>
  );
};

export const Planning = memo(_Planning);
