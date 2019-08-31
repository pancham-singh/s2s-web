import * as React from 'react';
import * as yup from 'yup';
import { Query } from 'react-apollo';
import CURRENT_USER from '@src/queries/current-user.graphql';
import { toast } from 'react-toastify';
import { Formik, Form, Field, FormikBag, FormikProps } from 'formik';
import { Mutation } from 'react-apollo';
import { ITrainingCenter } from '@src/model-types';
import CREATE_TRAINING_CENTER from '@src/queries/create-training-center.graphql';
import UPDATE_TRAINING_CENTER from '@src/queries/update-training-center.graphql';
import TC_LISTING from '@src/queries/training-center-listing.graphql';
import ApolloError from '@src/components/ApolloError';
import InputField from '@src/components/Form/Input';
import SelectUserField from '@src/components/Form/SelectUser';
import Loader from '@src/components/Loader';
import './style.scss';
import SelectField from '@src/components/Form/Select';
import hasRole from '@src/lib/hasRole';

interface FormData {
  id?: string;
  name: string;
  address: string;
  pia: string;
  incharge: string;
}

const handleCreateTrainingCenter = (mutation) => (
  values: FormData,
  { setStatus, setSubmitting, resetForm }: FormikBag<FormData, {}>
) => {
  setSubmitting(true);

  mutation({
    variables: values,
    update: (cache, { data: { createTrainingCenter: trainingCenter } }) => {
      const { trainingCenters } = cache.readQuery({ query: TC_LISTING });
      cache.writeQuery({
        query: TC_LISTING,
        data: { trainingCenters: trainingCenters.concat(trainingCenter) }
      });
    }
  })
    .then((res) => {
      setSubmitting(false);
      resetForm();

      toast('Created new Training Center', { type: 'success' });
    })
    .catch((err) => {
      setSubmitting(false);
      setStatus(err);
    });
};

const handleUpdateTrainingCenter = (mutation) => (
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

      toast('Successfully updated training center!', { type: 'success' });
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
  address: yup.string(),
  pia: yup.string().required('Cannot create a training center without a PIA'),
  incharge: yup.string()
});

const InnerForm = (formData: FormikProps<FormData>) => (
  <Query query={CURRENT_USER}>
    {({ data, loading, error }) => {
      if (loading) {
        return <Loader isVisible={loading} />;
      }

      if (error) {
        return <ApolloError error={error} />;
      }

      const user = data.currentUser;
      const isPia = hasRole(user)('pia');

      if (isPia && !formData.values.pia) {
        setImmediate(() => formData.setFieldValue('pia', String(user.id)));
      }

      return (
        <Form styleName="form-container">
          <h1>Training Center</h1>
          <Field name="name" label="Name of the TrainingCenter" component={InputField} />
          <Field name="address" label="Address" component={InputField} />

          {!isPia && <Field name="pia" label="PIA" component={SelectUserField} />}

          <Field name="incharge" label="Center Incharge" allowEmpty component={SelectUserField} />

          {formData.status && <ApolloError error={formData.status} />}

          <button className="btn-primary">Save</button>
        </Form>
      );
    }}
  </Query>
);

interface CreateTrainingCenterProps {
  trainingCenter?: ITrainingCenter;
}

const CreateNewTrainingCenter = (props: CreateTrainingCenterProps) => {
  let initialValues = {
    id: undefined,
    name: '',
    address: '',
    incharge: '',
    pia: ''
  };
  let mutation = CREATE_TRAINING_CENTER;
  let handleMutation = handleCreateTrainingCenter;

  if (props.trainingCenter) {
    const incharge =
      props.trainingCenter.incharges && props.trainingCenter.incharges.length
        ? props.trainingCenter.incharges[0]
        : null;
    initialValues = {
      id: props.trainingCenter.id,
      name: props.trainingCenter.name,
      address: props.trainingCenter.address,
      pia: props.trainingCenter.pia.id,
      incharge: incharge ? incharge.id : ''
    };
    mutation = UPDATE_TRAINING_CENTER;
    handleMutation = handleUpdateTrainingCenter;
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

export default CreateNewTrainingCenter;
