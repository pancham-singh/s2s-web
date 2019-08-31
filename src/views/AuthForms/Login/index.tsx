import * as React from 'react';
import * as classnames from 'classnames';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import { Formik, FormikProps, Form, Field, FormikActions, FormikBag } from 'formik';
import { Mutation, MutationProps, compose, graphql } from 'react-apollo';
import './style.scss';
import LOGIN from '@src/queries/login.graphql';
import CURRENT_USER from '@src/queries/current-user.graphql';
import InputField from '@src/components/Form/Input';
import { ApolloError } from 'apollo-client';
import { loginLocal, logoutLocal } from '@src/auth';

interface LoginFormData {
  email: string;
  password: string;
}

const handleSubmit = (mutation) => (
  values,
  { setSubmitting, setStatus, resetForm, props }: FormikBag<LoginFormProps, LoginFormData>
) => {
  setSubmitting(true);

  mutation({
    variables: values,
    update: (cache, { data: { login } }) => {
      cache.writeQuery({
        query: CURRENT_USER,
        data: { currentUser: { ...login.user, token: login.token } }
      });
    }
  })
    .then((res) => {
      loginLocal(res.data.login.token);
    })
    .catch((err: ApolloError) => {
      const hasGraphqlError = err.graphQLErrors.length;
      const error = (hasGraphqlError && err.graphQLErrors[0].message) || err.message;

      // Graphql error means token might be expired. Clear the token in that case
      if (hasGraphqlError) {
        logoutLocal();
      }

      setSubmitting(false);
      setStatus(error);
    });
};

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email('Must be a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters in length')
    .required('Password is required')
});

interface InnerFormProps {
  formData: FormikProps<LoginFormData>;
}
const InnerForm = ({ formData }: InnerFormProps) => (
  <Form styleName="login-form">
    <Field name="email" type="email" placeholder="Email" component={InputField} />
    <Field type="password" name="password" placeholder="Password" component={InputField} />

    <button styleName="login-btn" disabled={formData.isSubmitting}>
      Log In
    </button>

    {formData.status && <div className="form-error">{formData.status}</div>}
  </Form>
);

interface LoginFormProps {}
const LoginForm = (props: LoginFormProps) => (
  <div styleName="login-container">
    <Mutation mutation={LOGIN}>
      {(login, { data }) => (
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit(login)}
          render={(formData) => <InnerForm formData={formData} />}
        />
      )}
    </Mutation>
  </div>
);

export default LoginForm;
