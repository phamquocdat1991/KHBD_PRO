import React, {useEffect,useState} from 'react';
import {LessonImage} from '../../types';
import {loadImage} from '../../services/imageStore';

export function LessonImageFigure({image}:{image:LessonImage}) {
  const [src,setSrc] = useState('');
  const [error,setError] = useState('');
  useEffect(() => {
    let active = true;
    setSrc(''); setError('');
    if(image.assetId) loadImage(image.assetId).then(value => {if(active)setSrc(value);}).catch(e => {if(active)setError(e.message);});
    return () => {active=false;};
  },[image.assetId]);
  return <figure className="my-3 text-center break-inside-avoid">
    {src ? <img src={src} alt={image.title} className="mx-auto max-w-full max-h-[420px] object-contain"/> : <p role={error?'alert':undefined}>{error || 'Đang tải ảnh…'}</p>}
    <figcaption className="text-sm italic mt-2">{image.caption}</figcaption>
  </figure>;
}
