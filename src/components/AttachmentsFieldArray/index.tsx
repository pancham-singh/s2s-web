import * as React from 'react';
import * as classnames from 'classnames';
import { Field, FieldProps, FieldArray, FieldArrayConfig } from 'formik';
import { FieldArrayMetaProps } from 'redux-form';
import './style.scss';
import UploadImageField from '@src/components/Form/ImageUpload';

interface Attachment {
  type: 'image';
  url: string;
}

export interface AttachmentsFieldProps {
  name: string;
  errors?: any[];
  values?: Attachment[];
  fieldArrayOps: {
    insert: (index: number, v: any) => void;
    remove: <T>(i: number) => T;
    push: (v: any) => void;
  };
}

const AttachmentsField = ({ errors, values, name, fieldArrayOps }: AttachmentsFieldProps) => {
  const emptyAttachment: Attachment = { type: 'image', url: '' };

  return (
    <div>
      <div styleName="attachments">
        {values &&
          values.length > 0 &&
          values.map((a, index) => (
            <div key={index} styleName="attachment-row">
              <input type="hidden" name={`${name}.${index}.type`} />
              <Field
                component={UploadImageField}
                placeholder="Attachment Image url"
                name={`${name}[${index}].url`}
              />
              <i styleName="remove-attachment" onClick={() => fieldArrayOps.remove(index)} />
            </div>
          ))}
      </div>

      <button
        onClick={() => fieldArrayOps.push(emptyAttachment)}
        type="button"
        styleName="add-new-btn"
      >
        Add new attachment
      </button>
    </div>
  );
};

export default AttachmentsField;
