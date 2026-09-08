import React from 'react';
import Image from 'next/image';

function canUseNextImage(src) {
  return typeof src === 'string' && (src.startsWith('/') || src.startsWith('http://') || src.startsWith('https://'));
}

export default function ResponsiveImage({ alt, fill = false, priority = false, src, style, ...props }) {
  if (canUseNextImage(src)) {
    return <Image alt={alt} fill={fill} priority={priority} src={src} style={style} {...props} />;
  }

  const fillStyle = fill
    ? {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        ...style,
      }
    : style;

  return (
    <img
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      src={src}
      style={fillStyle}
      {...props}
    />
  );
}
