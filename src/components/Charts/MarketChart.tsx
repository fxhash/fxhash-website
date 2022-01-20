import style from "./MarketChart.module.scss"
import cs from "classnames"
import { useContext, useEffect, useRef, useState } from "react"
import useAsyncEffect from "use-async-effect"
import type { ECharts } from "echarts"
import MarketChartTheme from "./MarketChartTheme"
import format from "date-fns/format"
import { SettingsContext } from "../../context/Theme"


interface Props {
  data: any[] | null
}
export function MarketChart({ 
  data,
}: Props) {
  // reference to the DOM container of the chart
  const containerRef = useRef<HTMLDivElement>(null)

  const settings = useContext(SettingsContext)

  const [echart, setEchart] = useState<ECharts>()

  useAsyncEffect(async (isMounted) => {
    const EChartModule = await import("echarts")
    EChartModule.registerTheme("fxhash", MarketChartTheme)
    const chart = EChartModule.init(containerRef.current!, "fxhash", {
      renderer: "canvas"
    })
    const onResize = () => {
      chart.resize()
    }

    if (isMounted()) {
      setEchart(chart)
    }

    window.addEventListener("resize", onResize)

    return () => {
      window.removeEventListener("resize", onResize)
      chart.dispose()
    }
  }, [])

  useEffect(() => {
    if (echart && data) {
      echart.setOption({
        animation: false,
        backgroundColor: settings.theme.colors.white,
        textStyle: {
          fontFamily: "Fira code",
        },
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'none',
          axisPointer: {
            type: 'cross',
          }
        },
        xAxis: {
          data: data.map(d => d.time),
          axisLabel: {
            color: settings.theme.colors.gray,
            formatter: (value: any) => {
              return `${format(new Date(value), "dd/MM/yyyy hh:mm")}`
            },
          },
          axisPointer: {
            label: {
              formatter: (params: any) => {
                return `${format(new Date(params.value), "dd/MM/yyyy hh:mm")}`
              },
              fontSize: 14,
              backgroundColor: "#000000",
              borderRadius: 0,
            }
          },
          axisLine: {
            lineStyle: {
              width: 2,
              color: settings.theme.colors.gray,
            }
          },
          axisTick: {
            show: true,
            lineStyle: {
              width: 2,
              color: settings.theme.colors.gray,
            }
          },
          splitLine: {
            lineStyle: {
              color: settings.theme.colors["gray-vlight"]
            }
          }
        },
        yAxis: {
          axisLabel: {
            color: settings.theme.colors.gray,
          },
          axisPointer: {
            label: {
              formatter: (params: any) => {
                return `${params.value.toFixed(0)} tz`
              },
              fontSize: 14,
              backgroundColor: "#000000",
              borderRadius: 0,
            }
          },
          axisLine: {
            lineStyle: {
              width: 2,
              color: settings.theme.colors.gray,
            }
          },
          axisTick: {
            show: true,
            lineStyle: {
              width: 2,
              color: settings.theme.colors.gray,
            }
          },
          splitLine: {
            lineStyle: {
              color: settings.theme.colors["gray-vlight"]
            }
          }
        },
        series: [
          {
            name: 'sales',
            type: "line",
            smooth: 0.4,
            data: data.map(d => d.value),
            lineStyle: {
              color: settings.theme.colors.secondary,
              width: 4
            },
            symbolSize: 6,
            itemStyle: {
              color: settings.theme.colors.secondary
            },
            areaStyle: {
              opacity: 0.2
            }
          },
        ]
      })
    }
  }, [echart, data, settings.theme])

  return (
    <div className={cs(style.root)}>
      <div className={cs(style.chart_container)} ref={containerRef}/>
    </div>
  )
}