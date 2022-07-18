import React, { memo, useMemo } from 'react';
import style from "./ObjktImageAndName.module.scss";
import { Objkt } from "../../types/entities/Objkt";
import Link from "next/link";
import Image from "next/image";
import { ipfsGatewayUrl } from "../../services/Ipfs";

interface Props {
  objkt: Objkt,
  imagePriority?: boolean
  shortName?: boolean
  size?: number
}

const _ObjtkImageAndName = ({ 
  objkt,
  imagePriority,
  shortName,
  size = 40,
}: Props) => {
  const thumbnailUrl = useMemo(() => ipfsGatewayUrl(objkt.metadata?.thumbnailUri), [objkt])
  return (
    <Link href={`/gentk/${objkt.id}`}>
      <a className={style.container}>
        {thumbnailUrl &&
          <Image
            width={size}
            height={size}
            placeholder="blur"
            layout="fixed"
            src={thumbnailUrl}
            blurDataURL={thumbnailUrl}
            alt={`thumbnail of ${objkt.name}`}
            priority={imagePriority}
          />
        }
        <span className={style.name}>
          {shortName ? `#${objkt.iteration}` : objkt.name}
        </span>
      </a>
    </Link>
  );
};

export const ObjktImageAndName = memo(_ObjtkImageAndName);
