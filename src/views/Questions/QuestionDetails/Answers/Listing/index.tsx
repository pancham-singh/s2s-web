import * as React from 'react';
import { IAnswer } from '@src/model-types';

import './style.scss';
import { RouteComponentProps } from 'react-router';
import {imagePath} from '@src/config'
interface AnswerListingProps {
  answers: IAnswer[];
}

const AnswerListing = (props: AnswerListingProps) => (
  <ul styleName="listing">
    {props.answers.map((a) => (
      <li key={a.id} styleName="answer-list-item">
        <input styleName="is-correct-input" type="checkbox" defaultChecked={a.isCorrect} disabled />
          {a.attachments[0] && <img src={imagePath(a.attachments[0].url)} styleName="imageThumb"/>}
        <span styleName="body">{a.body}</span>
      </li>
    ))}
  </ul>
);

export default AnswerListing;
