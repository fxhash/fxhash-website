import style from "./LiveFeed.module.scss"
import cs from "classnames"
import { useLazyQuery } from "@apollo/client"
import { Qu_objktsFeed } from "../../queries/objkt"
import { useInterval } from "../../utils/hookts"
import { useRef, useState, useEffect } from "react"
import { subMinutes } from "date-fns"
import { Objkt } from "../../types/entities/Objkt"

export function LiveFeed() {
  const lastFetch = useRef<Date>(subMinutes(new Date(), 100))
  const [getObjktsFeed, { data, loading, error }] = useLazyQuery(Qu_objktsFeed, {
    fetchPolicy: "no-cache"
  })

  // 3 piles: to be revelead, revealing, revealed
  const [toReveal, setToReveal] = useState<Objkt[]>([])
  const [revealing, setRevealing] = useState<Objkt|null>(null)
  const [revealed, setRevealed] = useState<Objkt[]>([])

  useInterval(() => {
    getObjktsFeed({
      variables: {
        "filters": {
          "assigned_eq": "true",
          "assignedAt_gt": lastFetch.current.toISOString()
        },
        "take": 20
      }
    })
  }, 1500)

  useEffect(() => {
    if (!data) return
    console.log("data updated")
    console.log(data)

    // @ts-ignore update the date based on the most recent assignation
    const sortedByAssigned = [...data.objkts].sort((a: Objkt, b: Objkt) => new Date(b.assignedAt!) - new Date(a.assignedAt!))
    if (sortedByAssigned.length > 0) {
      lastFetch.current = new Date(sortedByAssigned[0].assignedAt)
    }
  }, [data])

  return (
    <div>live feed</div>
  )
}