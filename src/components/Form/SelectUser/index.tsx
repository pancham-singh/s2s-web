import * as React from 'react';
import * as classnames from 'classnames';
import { FieldProps } from 'formik';
import { Query } from 'react-apollo';
import USER_LISTING from '@src/queries/user-listing.graphql';

export interface SelectFieldProps extends FieldProps {
  label?: string;
  allowEmpty: boolean;
  classNames?: {
    wrapper?: string;
    wrapperHasError?: string;
    label?: string;
    field?: string;
    error?: string;
  };
}

const SelectUserField = ({
  allowEmpty,
  field,
  form,
  label,
  classNames,
  ...props
}: SelectFieldProps) => {
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
        <Query query={USER_LISTING}>
          {({ data, loading, error }) => {
            if (error) {
              return <option value={null}>Could not load users</option>;
            }

            if (loading) {
              return <option value={null}>...loading users list</option>;
            }

            if (!error && !loading) {
              let options = [<option key={'none'}>Unselected</option>];

              options = options.concat(
                data.users.map(({ id, name, email }) => (
                  <option key={id} value={id}>
                    {name} ({email})
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

export default SelectUserField;
