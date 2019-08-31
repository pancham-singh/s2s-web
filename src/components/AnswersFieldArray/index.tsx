import * as React from 'react';
import * as classnames from 'classnames';
import AddNewItemRow from '@src/components/AddNewItemRow';
import InputField from '@src/components/Form/Input';
import AttachmentsFieldArray from '@src/components/AttachmentsFieldArray';
import { Field, FieldProps, FieldArray, FieldArrayConfig } from 'formik';
import './style.scss';

interface AttachmentValue {
  type: 'image';
  url: string;
}

interface AnswerValue {
  body: string;
  isCorrect: boolean;
  attachments: AttachmentValue[];
}

export interface AnswersFieldProps {
  name: string;
  errors?: any[];
  values?: AnswerValue[];
  fieldArrayOps: {
    insert: (index: number, v: any) => void;
    remove: <T>(i: number) => T;
    push: (v: any) => void;
  };
}

const AnswersField = ({ errors, values, name, fieldArrayOps }: AnswersFieldProps) => {
  const emptyAnswer: AnswerValue = { body: '', isCorrect: false, attachments: [] };
  const emptyAttachment: AttachmentValue = { type: 'image', url: '' };

  return (
    <div>
      {values &&
        values.length > 0 &&
        values.map((a, index) => (
          <div key={index} styleName="answer-section">
            <i styleName="remove-answer" onClick={() => fieldArrayOps.remove(index)} />
            <Field
              component={InputField}
              label="Answer Body"
              placeholder="Body of the Answer"
              name={`${name}[${index}].body`}
            />
            <Field
              component={InputField}
              type="checkbox"
              label={'Is Correct?'}
              name={`${name}[${index}].isCorrect`}
              value={a.isCorrect}
              classNames={{ wrapper: 'checkbox-form-group' }}
            />
            <FieldArray
              name={`${name}[${index}].attachments`}
              render={(ops) => (
                <AttachmentsFieldArray
                  values={a.attachments}
                  name={`${name}[${index}].attachments`}
                  fieldArrayOps={ops}
                />
              )}
            />
          </div>
        ))}

      <AddNewItemRow title="Add new Answer" onClick={() => fieldArrayOps.push(emptyAnswer)} />
    </div>
  );
};

export default AnswersField;
