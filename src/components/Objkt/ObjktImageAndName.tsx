import React, { memo, useMemo } from 'react';
import style from "./ObjktImageAndName.module.scss";
import { Objkt } from "../../types/entities/Objkt";
import Link from "next/link";
import Image from "next/image";
import { ipfsGatewayUrl } from "../../services/Ipfs";

interface ObjtkImageAndNameProps {
  objkt: Objkt,
  imagePriority?: boolean
}

const _ObjtkImageAndName = ({ objkt, imagePriority }: ObjtkImageAndNameProps) => {
  const thumbnailUrl = useMemo(() => ipfsGatewayUrl(objkt.metadata?.thumbnailUri), [objkt])
  return (
    <Link href={`/gentk/${objkt.id}`}>
      <div className={style.container}>
        <div className={style.image}>
          {thumbnailUrl &&
            <Image
              width={40}
              height={40}
              placeholder="blur"
              layout="fixed"
              src={thumbnailUrl}
              blurDataURL={thumbnailUrl}
              alt={`thumbnail of ${objkt.name}`}
              priority={imagePriority}
            />
          }
        </div>
        <span className={style.name}>
          {objkt.name}
        </span>
      </div>
    </Link>
  );
};

export const ObjktImageAndName = memo(_ObjtkImageAndName);
