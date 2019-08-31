import * as React from 'react';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { Formik, Form, Field, FormikBag, FormikProps } from 'formik';
import { Mutation } from 'react-apollo';
import { IModule } from '@src/model-types';
import CREATE_MODULE from '@src/queries/create-module.graphql';
import UPDATE_MODULE from '@src/queries/update-module.graphql';
import MODULE_LISTING from '@src/queries/module-listing.graphql';
import ApolloError from '@src/components/ApolloError';
import InputField from '@src/components/Form/Input';
import './style.scss';
import { RouteComponentProps } from 'react-router';
import UploadImageField from '@src/components/Form/ImageUpload';

interface FormData {
  name: string;
  description: string;
  coverImage: string;
  courseId: string | number;
}

const handleCreateSubmit = (mutation) => (
  values: FormData,
  { setStatus, setSubmitting, resetForm }: FormikBag<FormData, {}>
) => {
  setSubmitting(true);

  mutation({
    variables: values,
    update: (cache, { data: { createModule } }) => {
      const { modules } = cache.readQuery({
        query: MODULE_LISTING,
        variables: { courseId: values.courseId }
      });
      cache.writeQuery({
        query: MODULE_LISTING,
        variables: { courseId: values.courseId },
        data: { modules: modules.concat(createModule) }
      });
    }
  })
    .then((res) => {
      setSubmitting(false);
      resetForm();

      toast('Created new module!', { type: 'success' });
    })
    .catch((err) => {
      setSubmitting(false);
      setStatus(err);
    });
};

const handleUpdateSubmit = (mutation) => (
  values: FormData,
  { setStatus, setSubmitting }: FormikBag<FormData, {}>
) => {
  setSubmitting(true);

  mutation({ variables: values })
    .then((res) => {
      setSubmitting(false);

      toast('Updated module!', { type: 'success' });
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
    .max(500, 'Name can not be longer than 500 characters'),
  description: yup.string().required('Description is required'),
  coverImage: yup.string().required('Cover image is required'),
  courseId: yup.string().required('Course ID can not be empty')
});

const InnerForm = (formData: FormikProps<FormData>) => (
  <Form styleName="form-container">
    <h1>Add new Module</h1>

    <Field name="courseId" component="input" type="hidden" />
    <Field name="name" label="Name of the Module" component={InputField} />
    <Field name="description" label="Description" component={InputField} />
    <Field name="coverImage" label="Cover Image" component={UploadImageField} />

    {formData.status && <ApolloError error={formData.status} />}

    <button className="btn-primary">Save</button>
  </Form>
);

interface CreateModuleProps extends RouteComponentProps<{ courseId: string }> {
  module?: IModule;
}

const CreateNewModule = (props: CreateModuleProps) => {
  const initialValues = props.module
    ? {
        id: props.module.id,
        name: props.module.name,
        description: props.module.description,
        coverImage: props.module.coverImage,
        courseId: props.module.course.id
      }
    : {
        name: '',
        description: '',
        coverImage: '',
        courseId: props.match.params.courseId
      };

  const handleSubmit = props.module ? handleUpdateSubmit : handleCreateSubmit;

  return (
    <Mutation mutation={props.module ? UPDATE_MODULE : CREATE_MODULE}>
      {(mutationFunc, { loading, error }) => (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit(mutationFunc)}
          render={InnerForm}
        />
      )}
    </Mutation>
  );
};

export default CreateNewModule;
