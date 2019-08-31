import * as React from 'react';
import * as classnames from 'classnames';
import { FieldProps } from 'formik';
import { Query } from 'react-apollo';
import { DocumentNode } from 'graphql';

export interface ISelectFieldProps extends FieldProps {
  label?: string;
  allowEmpty: boolean;
  query: DocumentNode;
  displayOption: (data: any) => string;
  dataNodeName: string;
  classNames?: {
    wrapper?: string;
    wrapperHasError?: string;
    label?: string;
    field?: string;
    error?: string;
  };
}

const SelectQueryField = ({
  allowEmpty,
  field,
  form,
  label,
  classNames,
  query,
  displayOption,
  ...props
}: ISelectFieldProps) => {
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
        <Query query={query}>
          {({ data, loading, error }) => {
            if (error) {
              return <option value={null}>Could not load options</option>;
            }

            if (loading) {
              return <option value={null}>...loading options</option>;
            }

            if (!error && !loading) {
              let options = [<option key={'none'}>Unselected</option>];

              options = options.concat(
                data[props.dataNodeName].map((d) => (
                  <option key={d.id} value={d.id}>
                    {displayOption(d)}
                  </option>
                ))
              );

              return options;
            }
          }}
        </Query>
      </select>

      {showError && <div className={classNames.error}>{error}</div>}
    </div>
  );
};

export default SelectQueryField;
