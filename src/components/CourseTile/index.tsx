import * as React from 'react';
import { ICourse } from '@src/model-types';
import './style.scss';
import isAbsoluteUrl from '@src/lib/isAbsoluteUrl';
import { apiUrls } from '@src/config';

interface CourseTileProps {
  course: ICourse;
}

const CourseTile = (props: CourseTileProps) => {
  const c = props.course;
  const coverImage = isAbsoluteUrl(c.coverImage)
    ? c.coverImage
    : apiUrls.uploadedImage(c.coverImage);

  return (
    <div
      styleName="container"
      style={{
        backgroundImage: `linear-gradient(rgba(34, 34, 34, 0.4), rgba(37, 33, 26, 0.4)), url(${coverImage})`
      }}
    >
      <div styleName="title">{c.name}</div>
    </div>
  );
};

export default CourseTile;
