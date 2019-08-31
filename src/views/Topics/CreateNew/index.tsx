import * as React from 'react';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { Formik, Form, Field, FormikBag, FormikProps } from 'formik';
import { Mutation } from 'react-apollo';
import { ITopic } from '@src/model-types';
import TOPIC_LISTING from '@src/queries/topic-listing.graphql';
import CREATE_TOPIC from '@src/queries/create-topic.graphql';
import UPDATE_TOPIC from '@src/queries/update-topic.graphql';
import ApolloError from '@src/components/ApolloError';
import InputField from '@src/components/Form/Input';
import './style.scss';
import { RouteComponentProps } from 'react-router';
import UploadImageField from '@src/components/Form/ImageUpload';

interface FormData {
  name: string;
  description: string;
  coverImage: string;
  pointsPractical: number;
  pointsTheory: number;
  moduleId: string | number;
}

interface RouteParams {
  moduleId: string;
}

const handleCreateSubmit = (mutation) => (
  values: FormData,
  { setStatus, setSubmitting, resetForm }: FormikBag<FormData, {}>
) => {
  setSubmitting(true);

  mutation({
    variables: values,
    update: (cache, { data: { createTopic } }) => {
      const { topics } = cache.readQuery({
        query: TOPIC_LISTING,
        variables: { moduleId: values.moduleId }
      });
      cache.writeQuery({
        query: TOPIC_LISTING,
        variables: { moduleId: values.moduleId },
        data: { topics: topics.concat(createTopic) }
      });
    }
  })
    .then((res) => {
      setSubmitting(false);
      resetForm();

      toast('Created new topic!', { type: 'success' });
    })
    .catch((err) => {
      setSubmitting(false);
      setStatus(err);
    });
};

const handleUpdateSubmit = (mutation) => (
  values: FormData,
  { setStatus, setSubmitting, resetForm }: FormikBag<FormData, {}>
) => {
  setSubmitting(true);

  mutation({ variables: values })
    .then((res) => {
      setSubmitting(false);
      resetForm();

      toast('Successfully updated topic!', { type: 'success' });
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
  moduleId: yup.string().required('Module ID can not be empty'),
  pointsPractical: yup
    .number()
    .required('Practical exam points are required')
    .min(0),
  pointsTheory: yup
    .number()
    .required('Theory exam points are required')
    .min(0)
});

const InnerForm = (formData: FormikProps<FormData>) => (
  <Form styleName="form-container">
    <h1>Topic</h1>

    <Field name="moduleId" component="input" type="hidden" />
    <Field name="name" label="Name of the Topic" component={InputField} />
    <Field name="description" label="Description" component={InputField} />
    <Field name="coverImage" label="Cover Image" component={UploadImageField} />
    <Field
      name="pointsPractical"
      label="Practical Exam Points"
      type="number"
      component={InputField}
    />
    <Field name="pointsTheory" label="Theory Exam Points" type="number" component={InputField} />

    {formData.status && <ApolloError error={formData.status} />}

    <button className="btn-primary">Save</button>
  </Form>
);

interface CreateTopicProps extends RouteComponentProps<RouteParams> {
  topic?: ITopic;
}

const CreateNewTopic = (props: CreateTopicProps) => {
  const initialValues = props.topic
    ? {
        id: props.topic.id,
        name: props.topic.name,
        description: props.topic.description,
        coverImage: props.topic.coverImage,
        moduleId: props.topic.module.id,
        pointsTheory: props.topic.pointsTheory,
        pointsPractical: props.topic.pointsPractical
      }
    : {
        name: '',
        description: '',
        coverImage: '',
        moduleId: props.match.params.moduleId,
        pointsTheory: 0,
        pointsPractical: 0
      };

  const handleSubmit = props.topic ? handleUpdateSubmit : handleCreateSubmit;

  return (
    <Mutation mutation={props.topic ? UPDATE_TOPIC : CREATE_TOPIC}>
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

export default CreateNewTopic;
