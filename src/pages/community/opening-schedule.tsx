import cs from "classnames"
import layout from "../../styles/Layout.module.scss"
import style from "./OpeningSchedule.module.scss"
import { NextPage } from "next"
import Link from "next/link"
import { SectionHeader } from "../../components/Layout/SectionHeader"
import { TitleHyphen } from "../../components/Layout/TitleHyphen"
import { Spacing } from "../../components/Layout/Spacing"
import Head from "next/head"
import { useMemo, useState } from "react"
import { ClientOnlyEmpty } from "../../components/Utils/ClientOnly"
import { ContractsOpened } from "../../components/Utils/ContractsOpened"
import { Schedule } from "../../containers/Community/Schedule"
import { getLocalTimezone, Timezone, timezones, timezoneSearchKeys } from "../../utils/timzones"
import { IOptions, Select } from "../../components/Input/Select"
import { Field } from "../../components/Form/Field"
import { InputTextUnit } from "../../components/Input/InputTextUnit"
import { InputText } from "../../components/Input/InputText"


const optionsTimezones: IOptions[] = timezones.map(timezone => ({
  label: timezone.text,
  value: timezone.value
}))

const SchedulePage: NextPage = () => {
  const [timezone, setTimezone] = useState<Timezone>(getLocalTimezone())
  const updateTimezone = (value: string) => setTimezone(timezones.find(tz => tz.value === value)!)
  const [nbDays, setNbDays] = useState<number>(7)

  return (
    <>
      <Head>
        <title>fxhash — opening schedule</title>
        <meta key="og:title" property="og:title" content="fxhash — opening schedule"/> 
        <meta key="description" name="description" content="The opening schedule of fxhash"/>
        <meta key="og:description" property="og:description" content="The opening schedule of fxhash"/>
        <meta key="og:type" property="og:type" content="website"/>
        <meta key="og:image" property="og:image" content="https://www.fxhash.xyz/images/og/og1.jpg"/>
      </Head>

      <Spacing size="6x-large" />

      <section>
        <SectionHeader>
          <TitleHyphen>opening schedule</TitleHyphen>
        </SectionHeader>

        <Spacing size="3x-large" />

        <main className={cs(layout['padding-big'])}>
          <p>The publication of new Generative Tokens follows a schedule. When the schedule is closed, new Generative Tokens cannot be published on the platform, but minting unique iterations and interacting with the marketplace will remain possible.</p>
          <p>The indicator on the top-right [🔴/🟢] reflects the current state of the opening for Generative Tokens.</p>

          <Spacing size="3x-large" />

          <ClientOnlyEmpty>
            <h4>Current state</h4>
            <Spacing size="small"/>
            <ContractsOpened/>
          </ClientOnlyEmpty>

          <Spacing size="3x-large" />

          <h4>Planning</h4>
          <Spacing size="small"/>
          <div className={cs(style.selects)}>
            <Field className={cs(style.select_timezone)}>
              <label>Timezone</label>
              <Select
                value={timezone.value}
                options={optionsTimezones}
                onChange={updateTimezone}
                search={true}
                searchKeys={timezoneSearchKeys}
                searchDictionnary={timezones}
                searchValue="value"
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
          <ClientOnlyEmpty>
            <Schedule
              timezone={timezone}
              nbDays={nbDays}
            />
          </ClientOnlyEmpty>

          <Spacing size="6x-large" />
        </main>
      </section>
    </>
  )
}

export default SchedulePage