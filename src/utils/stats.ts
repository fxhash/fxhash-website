import { GenerativeTokenMarketStatsHistory } from "../types/entities/GenerativeToken"
import { arrayAverage, arraySum } from "./array"

export function cleanGeneratorMarketStatHistory(history: GenerativeTokenMarketStatsHistory[]): GenerativeTokenMarketStatsHistory[] {
  for (const stat of history) {
    stat.floor = stat.floor ?? 0
    stat.median = stat.median ?? 0
    stat.listed = stat.listed ?? 0
    stat.highestSold = stat.highestSold ?? 0
    stat.lowestSold = stat.lowestSold ?? 0
    stat.primVolumeTz = stat.primVolumeTz ?? 0
    stat.primVolumeNb = stat.primVolumeNb ?? 0
    stat.secVolumeTz = stat.secVolumeTz ?? 0
    stat.secVolumeNb = stat.secVolumeNb ?? 0
  }
  return history
}

export function aggregateGeneratorMarketStatHistory(history: GenerativeTokenMarketStatsHistory[]): GenerativeTokenMarketStatsHistory {
  return {
    floor: arrayAverage(history.map(stat => stat.floor!)),
    median: arrayAverage(history.map(stat => stat.median!)),
    listed: arrayAverage(history.map(stat => stat.listed!)),
    highestSold: arrayAverage(history.map(stat => stat.highestSold!)),
    lowestSold: arrayAverage(history.map(stat => stat.lowestSold!)),
    primVolumeTz: arraySum(history.map(stat => stat.primVolumeTz!)),
    primVolumeNb: arraySum(history.map(stat => stat.primVolumeNb!)),
    secVolumeTz: arraySum(history.map(stat => stat.secVolumeTz!)),
    secVolumeNb: arraySum(history.map(stat => stat.secVolumeNb!)),
    from: history[0].from,
    to: history[history.length-1].to,
  }
}

export function aggregateBatchesGeneratorMarketStatHistory(
  history: GenerativeTokenMarketStatsHistory[],
  maxSize = 12,
): GenerativeTokenMarketStatsHistory[] {
  // how much aggregation needs to be made
  const batchSize = history.length / maxSize | 0

  let batched = history

  if (batchSize > 1) {
    batched = []
    let nbBatched = 0
    while (nbBatched < history.length) {
      const batch = history.slice(nbBatched, nbBatched + batchSize)
      batched.push(aggregateGeneratorMarketStatHistory(batch))
      nbBatched += batchSize
    }
  }

  return batched
}