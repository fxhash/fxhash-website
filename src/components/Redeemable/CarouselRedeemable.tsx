import React, { memo, useCallback, useState } from "react"
import { Carousel } from "../Carousel/Carousel"
import style from "./CarouselRedeemable.module.scss"
import { EventMedia } from "../../types/entities/EventMedia";

const carouselOpts = {
  showButtonControls: false,
  showDots: true,
}
interface CarouselRedeemableProps {
  medias: {
    index: number
    media: EventMedia
  }[]
}

const _CarouselRedeemable = ({ medias }: CarouselRedeemableProps) => {
  const [pageMedias, setPageMedias] = useState(0)
  const renderCarouselSlide = useCallback(
    (page) => {
      const med = medias[page]
      return (
        <div className={style.container_img}>
          <img alt={med.media.name} src={med.media.url} />
        </div>
      )
    },
    [medias]
  )
  return (
    <Carousel
      className={style.carousel}
      classNameDots={style.dots}
      page={pageMedias}
      totalPages={medias.length}
      onChangePage={setPageMedias}
      options={carouselOpts}
      renderSlide={renderCarouselSlide}
    />
  )
}

export const CarouselRedeemable = memo(_CarouselRedeemable)
