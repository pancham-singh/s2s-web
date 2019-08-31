import * as React from 'react';
import { ITopic } from '@src/model-types';
import './style.scss';

interface TopicTileProps {
  topic: ITopic;
}

const TopicTile = (props: TopicTileProps) => {
  const c = props.topic;

  return (
    <div
      styleName="container"
      style={{
        backgroundImage: `linear-gradient(rgba(34, 34, 34, 0.4), rgba(37, 33, 26, 0.4)), url(${
          c.coverImage
        })`
      }}
    >
      <div styleName="title">{c.name}</div>
    </div>
  );
};

export default TopicTile;
