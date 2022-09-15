// import style from "./Chart.module.scss"
import cs from "classnames"
import { format } from "date-fns";
import { useMemo } from "react"
import { Line } from "react-chartjs-2"
import { Report } from "../../types/entities/Report";

interface Props {
  reports: Report[]
  className?: string
}
export function Chart({
  reports,
  className,
}: Props) {
  // the data needs to be aggregated
  const aggregated = useMemo(() => {
    // 1. sort the data by date
    // @ts-ignore
    const sorted = reports.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    // exclude reports > 12 hours
    const now = Date.now()
    const cleaned = sorted.filter(report => now - (new Date(report.createdAt)).getTime() < 12*3600*1000)
    // if no data, bye
    if (cleaned.length === 0) return []
    // get the oldest item, and the time difference between now and oldest
    const oldest = cleaned[0]
    const oldestTime = (new Date(oldest.createdAt)).getTime()
    const diff = now - oldestTime   // in ms

    // define the range between each aggregation
    const rangeMs = (diff/10)

    // starting from the oldest time + range, aggregate the data 
    const aggregated = []

    for (let i = 0; i < 10-1; i++) {
      const startTimeMs = oldestTime + rangeMs*i
      const maxTimeMs = oldestTime + rangeMs*(i+1)
      // create a new entry in aggregated
      const aggregate = {
        label: format(new Date(maxTimeMs), "H:mm"),
        values: 0
      }
      // go though each item andfind those under maxTime
      for (let i = cleaned.length-1; i >= 0; i--) {
        if (new Date(cleaned[i].createdAt).getTime() < maxTimeMs) {
          cleaned.splice(i, 1)
          aggregate.values++
        }
      }
      aggregated.push(aggregate)
    }
    return aggregated
  }, [reports])

  const data = useMemo(() => {
    return {
      labels: aggregated.map(aggregate => aggregate.label),
      datasets: [
        {
          label: '# of Reports',
          data: aggregated.map(aggregate => aggregate.values),
          fill: false,
          backgroundColor: 'rgb(255, 0, 0)',
          borderColor: 'rgba(255, 102, 102, 0.2)',
        },
      ],
    }
  }, [aggregated])
  
  const options = {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <Line
      data={data}
      options={options}
      className={className}
    />
  )
}

export default Chart