import * as React from 'react';
import * as yup from 'yup';
import { Formik, Form, Field, FormikActions, FormikProps } from 'formik';
import { Mutation } from 'react-apollo';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import InputField from '@src/components/Form/Input';
import REGISTER from '@src/queries/register.graphql';
import CURRENT_USER from '@src/queries/current-user.graphql';

import './style.scss';
import { ApolloError } from 'apollo-client';
import { loginLocal, logoutLocal } from '@src/auth';

interface SignupFormData {
  email: string;
  name: string;
  password: string;
  role: string;
}

const handleSubmit = (mutation) => (
  values: SignupFormData,
  { setSubmitting, setStatus, resetForm }: FormikActions<SignupFormData>
) => {
  setSubmitting(true);

  mutation({
    variables: values,

    update: (cache, { data: { createUser } }) => {
      cache.writeQuery({
        query: CURRENT_USER,
        data: { currentUser: createUser.user }
      });
    }
  })
    .then((res) => {
      loginLocal(res.data.createUser.token);
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
  name: yup.string(),
  email: yup
    .string()
    .email('Must be a valid email')
    .required('Email is required'),
  role: yup
    .string()
    .oneOf(['student', 'teacher'])
    .required(),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters in length')
    .required('Password is required')
});

interface InnerFormProps {
  formData: FormikProps<SignupFormData>;
}
const InnerForm = ({ formData }: InnerFormProps) => (
  <Form styleName="signup-form">
    <Field name="role" type="hidden" component={InputField} />
    <Field name="name" component={InputField} placeholder="Name" />
    <Field name="email" type="email" component={InputField} placeholder="Email" />
    <Field name="password" type="password" component={InputField} placeholder="Password" />

    <button
      disabled={formData.isSubmitting}
      onClick={() => {
        formData.setValues({ ...formData.values, role: 'student' });
        formData.submitForm();
      }}
      styleName="student-signup-btn"
    >
      Signup as a Student
    </button>
    <button
      onClick={() => {
        formData.setValues({ ...formData.values, role: 'teacher' });
        formData.submitForm();
      }}
      disabled={formData.isSubmitting}
      styleName="teacher-signup-btn"
    >
      Signup as a teacher
    </button>

    {formData.status && <div className="form-error">{formData.status}</div>}
  </Form>
);

interface SignupFormProps {}
const SignupForm = (props: SignupFormProps) => {
  return (
    <div styleName="signup-container">
      <Mutation mutation={REGISTER}>
        {(register) => (
          <Formik
            initialValues={{ name: '', email: '', password: '', role: 'student' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit(register)}
            render={(formData) => <InnerForm formData={formData} />}
          />
        )}
      </Mutation>
    </div>
  );
};

export default SignupForm;
