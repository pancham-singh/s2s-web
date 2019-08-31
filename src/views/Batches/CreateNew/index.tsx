import ApolloError from '@src/components/ApolloError';
import { format } from 'fecha';
import InputField from '@src/components/Form/Input';
import SelectField from '@src/components/Form/Select';
import SelectQueryField from '@src/components/Form/SelectFromQuery';
import Loader from '@src/components/Loader';
import hasRole from '@src/lib/hasRole';
import { IBatch } from '@src/model-types';
import BATCH_LISTING from '@src/queries/batches-listing.graphql';
import TC_LISTING from '@src/queries/training-center-listing.graphql';
import COURSE_LISTING from '@src/queries/course-listing.graphql';
import CREATE_BATCH from '@src/queries/create-batch.graphql';
import UPDATE_BATCH from '@src/queries/update-batch.graphql';
import { Field, Form, Formik, FormikBag, FormikProps } from 'formik';
import * as React from 'react';
import { Mutation } from 'react-apollo';
import { Query } from 'react-apollo';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import './style.scss';

interface IFormData {
  id?: string;
  name: string;
  startDate: Date;
  endDate: Date;
  courseId: string;
  batchId: string;
}

const handleCreateBatch = (mutation) => (
  values: IFormData,
  { setStatus, setSubmitting, resetForm }: FormikBag<IFormData, {}>
) => {
  setSubmitting(true);

  mutation({
    variables: values,
    update: (cache, { data: { createBatch: batch } }) => {
      const { batches } = cache.readQuery({ query: BATCH_LISTING });
      cache.writeQuery({
        query: BATCH_LISTING,
        data: { batches: batches.concat(batch) }
      });
    }
  })
    .then((res) => {
      setSubmitting(false);
      resetForm();

      toast('Created new Batch', { type: 'success' });
    })
    .catch((err) => {
      setSubmitting(false);
      setStatus(err);
    });
};

const handleUpdateBatch = (mutation) => (
  values: IFormData,
  { setStatus, setSubmitting, resetForm }: FormikBag<IFormData, {}>
) => {
  setSubmitting(true);

  mutation({
    variables: values
  })
    .then((res) => {
      setSubmitting(false);
      resetForm();

      toast('Successfully updated batch!', { type: 'success' });
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
  startDate: yup
    .date()
    .required('Start Date is required')
    .max(yup.ref('endDate'), 'Start date cannot be after End date'),
  endDate: yup
    .date()
    .required('End Date is required')
    .min(yup.ref('startDate'), 'End date cannot be less than Start date'),
  courseId: yup.string().required('Please select the course of the batch'),
  trainingCenterId: yup.string().required('Please select a Training Center')
});

const InnerForm = (formData: FormikProps<IFormData>) => (
  <Form styleName="form-container">
    <h1>Batch</h1>
    <Field name="name" label="Name of the Batch" component={InputField} />
    <Field name="startDate" type="date" label="Start Date" component={InputField} />
    <Field name="endDate" type="date" label="End Date" component={InputField} />
    <Field
      name="trainingCenterId"
      label="Training Center"
      component={SelectQueryField}
      query={TC_LISTING}
      displayOption={(d) => `${d.name} ${d.address && '(' + d.address + ')'}`}
      dataNodeName="trainingCenters"
    />
    <Field
      name="courseId"
      label="Course"
      component={SelectQueryField}
      dataNodeName="courses"
      query={COURSE_LISTING}
      displayOption={(d) => `${d.name}`}
    />

    {formData.status && <ApolloError error={formData.status} />}

    <button className="btn-primary">Save</button>
  </Form>
);

interface ICreateBatchProps {
  batch?: IBatch;
}

const CreateNewBatch = (props: ICreateBatchProps) => {
  let initialValues = {
    id: undefined,
    name: '',
    startDate: format(new Date(), 'YYYY-MM-DD'),
    endDate: format(new Date(), 'YYYY-MM-DD'),
    trainingCenterId: '',
    courseId: ''
  };
  let mutation = CREATE_BATCH;
  let handleMutation = handleCreateBatch;

  if (props.batch) {
    initialValues = {
      id: props.batch.id,
      name: props.batch.name,
      startDate: format(new Date(props.batch.startDate), 'YYYY-MM-DD'),
      endDate: format(new Date(props.batch.endDate), 'YYYY-MM-DD'),
      courseId: props.batch.course.id,
      trainingCenterId: props.batch.trainingCenter.id
    };
    mutation = UPDATE_BATCH;
    handleMutation = handleUpdateBatch;
  }

  return (
    <Mutation mutation={mutation}>
      {(mutationFunc, { loading, error }) => (
        <div>
          <Loader isVisible={loading} />
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleMutation(mutationFunc)}
            render={InnerForm}
          />
        </div>
      )}
    </Mutation>
  );
};

export default CreateNewBatch;
