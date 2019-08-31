import * as React from 'react';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { Formik, Form, Field, FormikBag, FormikProps } from 'formik';
import { Mutation } from 'react-apollo';
import { IUser } from '@src/model-types';
import CREATE_USER from '@src/queries/create-user.graphql';
import USER_LISTING from '@src/queries/user-listing.graphql';
import ApolloError from '@src/components/ApolloError';
import InputField from '@src/components/Form/Input';
import './style.scss';
import SelectField from '@src/components/Form/Select';

interface FormData {
  id?: string;
  name: string;
  email: string;
  role: string;
  password: string;
}

const handleCreateUser = (mutation) => (
  values: FormData,
  { setStatus, setSubmitting, resetForm }: FormikBag<FormData, {}>
) => {
  setSubmitting(true);

  mutation({
    variables: values,
    update: (cache, { data: { createUser: { user } } }) => {
      const { users } = cache.readQuery({ query: USER_LISTING });
      cache.writeQuery({
        query: USER_LISTING,
        data: { users: users.concat(user) }
      });
    }
  })
    .then((res) => {
      setSubmitting(false);
      resetForm();

      toast('Created new user', { type: 'success' });
    })
    .catch((err) => {
      setSubmitting(false);
      setStatus(err);
    });
};

const handleUpdateUser = (mutation) => (
  values: FormData,
  { setStatus, setSubmitting, resetForm }: FormikBag<FormData, {}>
) => {
  setSubmitting(true);

  mutation({
    variables: values
  })
    .then((res) => {
      setSubmitting(false);
      resetForm();

      toast('Successfully updated user!', { type: 'success' });
    })
    .catch((err) => {
      setSubmitting(false);
      setStatus(err);
    });
};

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .required('Name is required')
    .max(140, 'Name can not be longer than 140 characters'),
  email: yup
    .string()
    .email()
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password should at least be 6 characters long')
    .required('Email is required'),
  role: yup
    .string()
    .required('Role is required')
    .oneOf(['admin', 'pia', 'centerIncharge', 'teacher', 'student'])
});

const InnerForm = (formData: FormikProps<FormData>) => (
  <Form styleName="form-container">
    <h1>Add new User</h1>
    <Field name="name" label="Name of the User" component={InputField} />
    <Field name="email" label="Email" component={InputField} />
    <Field name="password" label="Password" type="password" component={InputField} />
    <Field
      name="role"
      label="Role"
      component={SelectField}
      options={[{ title: 'Admin', value: 'admin' }, { title: 'Pia', value: 'pia' }]}
    />

    {formData.status && <ApolloError error={formData.status} />}

    <button className="btn-primary">Save</button>
  </Form>
);

interface CreateUserProps {
  user?: IUser;
}

const CreateNewUser = (props: CreateUserProps) => {
  const initialValues = props.user
    ? {
        id: props.user.id,
        name: props.user.name,
        email: props.user.email,
        password: '',
        role: props.user.roles.length ? props.user.roles[0].name : 'student'
      }
    : {
        name: '',
        email: '',
        role: 'pia',
        password: ''
      };
  const mutation = CREATE_USER;
  const handleMutation = handleCreateUser;

  return (
    <Mutation mutation={mutation}>
      {(mutationFunc, { loading, error }) => (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleMutation(mutationFunc)}
          render={InnerForm}
        />
      )}
    </Mutation>
  );
};

export default CreateNewUser;
