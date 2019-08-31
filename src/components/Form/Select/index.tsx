import * as React from 'react';
import * as classnames from 'classnames';
import { FieldProps } from 'formik';

interface SelectOption {
  title: string;
  value: string | number;
}

export interface SelectFieldProps extends FieldProps {
  label?: string;
  options: SelectOption[];
  classNames?: {
    wrapper?: string;
    wrapperHasError?: string;
    label?: string;
    field?: string;
    error?: string;
  };
}

const SelectField = ({ field, form, label, options, classNames }: SelectFieldProps) => {
  const touched = form.touched[field.name];
  const error = form.errors[field.name];

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
      <select {...field} className={classNames.field}>
        {options.map(({ title, value }) => (
          <option key={value} value={value}>
            {title}
          </option>
        ))}
      </select>

      {showError && <div className={classNames.error}>{error}</div>}
    </div>
  );
};

export default SelectField;
