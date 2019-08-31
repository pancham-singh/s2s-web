import * as React from 'react';
import * as classnames from 'classnames';
import { FieldProps } from 'formik';
import * as get from 'lodash/fp/get';

export interface InputFieldProps extends FieldProps {
  type?: string;
  // Only field matching this pattern is allowed to be entered
  pattern?: RegExp;
  placeholder?: string;
  label?: string;
  value?: string | number | boolean;
  disabled?: boolean;
  classNames?: {
    wrapper?: string;
    wrapperHasError?: string;
    wrapperHasWarning?: string;
    field?: string;
    error?: string;
    warning?: string;
    label?: string;
  };
}

const InputField = ({
  field,
  form,
  type,
  pattern,
  placeholder,
  label,
  classNames,
  disabled
}: InputFieldProps) => {
  const onChange = (e) => {
    const val = e.target.value;

    if (val && pattern && !pattern.test(val)) {
      return;
    }

    field.onChange(e);
  };

  const getFieldValue = get(field.name);

  const touched = getFieldValue(form.touched);
  const error = getFieldValue(form.errors);

  const showError = touched && error;

  classNames = {
    wrapper: 'input-group',
    wrapperHasError: 'has-error',
    field: 'form-control',
    error: 'error',
    label: 'label',
    ...(classNames || {})
  };

  return (
    <div
      className={classnames(classNames.wrapper, {
        [classNames.wrapperHasError]: showError
      })}
    >
      {label && <label className={classNames.label}>{label}</label>}

      <input
        {...field}
        onChange={onChange}
        type={type}
        checked={field.value}
        className={classNames.field}
        disabled={disabled}
        placeholder={placeholder || ''}
      />

      {showError && <div className={classNames.error}>{error}</div>}
    </div>
  );
};

export default InputField;
