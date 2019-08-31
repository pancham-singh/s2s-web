import * as React from 'react';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { Formik, Form, Field, FormikBag, FormikProps } from 'formik';
import { Mutation } from 'react-apollo';
import { ICourse } from '@src/model-types';
import CREATE_COURSE from '@src/queries/create-course.graphql';
import UPDATE_COURSE from '@src/queries/update-course.graphql';
import COURSE_LISTING from '@src/queries/course-listing.graphql';
import ApolloError from '@src/components/ApolloError';
import InputField from '@src/components/Form/Input';
import './style.scss';
import SelectField from '@src/components/Form/Select';
import UploadImageField from '@src/components/Form/ImageUpload';

interface FormData {
  id?: string;
  name: string;
  description: string;
  coverImage: string;
  category: 'domain' | 'non-domain';
}

const handleCreateCourse = (mutation) => (
  values: FormData,
  { setStatus, setSubmitting, resetForm }: FormikBag<FormData, {}>
) => {
  setSubmitting(true);

  mutation({
    variables: values,
    update: (cache, { data: { createCourse } }) => {
      const { courses } = cache.readQuery({ query: COURSE_LISTING });
      cache.writeQuery({
        query: COURSE_LISTING,
        data: { courses: courses.concat(createCourse) }
      });
    }
  })
    .then((res) => {
      setSubmitting(false);
      resetForm();

      toast('Created new course', { type: 'success' });
    })
    .catch((err) => {
      setSubmitting(false);
      setStatus(err);
    });
};

const handleUpdateCourse = (mutation) => (
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

      toast('Successfully updated course!', { type: 'success' });
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
  category: yup.string().oneOf(['domain', 'non-domain'])
});

const InnerForm = (formData: FormikProps<FormData>) => (
  <Form styleName="form-container">
    <h1>Add new Course</h1>
    <Field name="name" label="Name of the Course" component={InputField} />
    <Field name="description" label="Description" component={InputField} />
    <Field name="coverImage" label="Cover Image" component={UploadImageField} />
    <Field
      name="category"
      label="Category of Course"
      component={SelectField}
      options={[
        {
          title: 'Domain',
          value: 'domain'
        },
        {
          title: 'Non-Domain',
          value: 'non-domain'
        }
      ]}
    />

    {formData.status && <ApolloError error={formData.status} />}

    <button className="btn-primary">Save</button>
  </Form>
);

interface CreateCourseProps {
  course?: ICourse;
}

const CreateNewCourse = (props: CreateCourseProps) => {
  const initialValues = props.course
    ? {
        id: props.course.id,
        name: props.course.name,
        description: props.course.description,
        coverImage: props.course.coverImage,
        category: props.course.category
      }
    : {
        name: '',
        description: '',
        coverImage: '',
        category: 'domain'
      };
  const mutation = props.course ? UPDATE_COURSE : CREATE_COURSE;
  const handleMutation = props.course ? handleUpdateCourse : handleCreateCourse;

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

export default CreateNewCourse;
