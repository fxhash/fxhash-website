import effect from "../../styles/Effects.module.scss"
import React, { memo, useMemo } from 'react';
import cs from 'classnames';

interface SkeletonProps {
  width?: string,
  height: string,
  className?: string,
}

export const Skeleton = memo(({ width = "auto", height, className }: SkeletonProps) => {
  const style = useMemo(() => ({ maxWidth: width, width: '100%', height }), [height, width])
  return (
    <div className={cs(effect.placeholder, className)} style={style} />
  );
});
Skeleton.displayName = 'Skeleton';
