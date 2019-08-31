import ApolloError from '@src/components/ApolloError';
import InputField from '@src/components/Form/Input';
import SelectField from '@src/components/Form/Select';
import SelectQueryField from '@src/components/Form/SelectFromQuery';
import Loader from '@src/components/Loader';
import { IBatch, IInvitation } from '@src/model-types';
import BATCH_LISTING from '@src/queries/batches-listing.graphql';
import CREATE_INVITATION from '@src/queries/create-invitation.graphql';
import INVITATION_LISTING from '@src/queries/invitation-listing.graphql';
import TC_LISTING from '@src/queries/training-center-listing.graphql';
import { format } from 'fecha';
import { Field, Form, Formik, FormikBag, FormikProps } from 'formik';
import * as React from 'react';
import { Mutation } from 'react-apollo';
import { Query } from 'react-apollo';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import './style.scss';

interface IFormData {
  id?: string;
  invitedEmail: string;
  invitedById: string;
  invitedAs: string;
  validTill: Date;
  batchId: string;
  trainingCenterId: string;
}

const validInvitedAsRoles = ['student', 'teacher', 'centerIncharge'];

const handleCreateInvitation = (mutation) => (
  values: IFormData,
  { setStatus, setSubmitting, resetForm }: FormikBag<IFormData, {}>
) => {
  setSubmitting(true);

  mutation({
    variables: values,
    update: (cache, { data: { createInvitation: invitation } }) => {
      const { invitations } = cache.readQuery({ query: INVITATION_LISTING });
      cache.writeQuery({
        query: INVITATION_LISTING,
        data: { invitations: invitations.concat(invitation) }
      });
    }
  })
    .then((res) => {
      setSubmitting(false);
      resetForm();

      toast('Created new Invitation', { type: 'success' });
    })
    .catch((err) => {
      setSubmitting(false);
      setStatus(err);
    });
};

const handleUpdateInvitation = (mutation) => (
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

      toast('Successfully updated invitation!', { type: 'success' });
    })
    .catch((err) => {
      setSubmitting(false);
      setStatus(err);
    });
};

const validationSchema = yup.object().shape({
  invitedEmail: yup
    .string()
    .email()
    .required('Email is required'),
  validTill: yup.date().min(new Date(), 'Can not create already expired invitation'),
  invitedAs: yup.string().oneOf(validInvitedAsRoles),
  batchId: yup.string(),
  trainingCenterId: yup.string().required('Please select a Training Center')
});

const InnerForm = (formData: FormikProps<IFormData>) => (
  <Form styleName="form-container">
    <h1>Invitation</h1>

    <Field name="invitedEmail" label="Invited User's Email" type="email" component={InputField} />
    <Field name="validTill" type="date" label="Valid Till" component={InputField} />
    <Field
      name="trainingCenterId"
      label="Training Center"
      component={SelectQueryField}
      query={TC_LISTING}
      displayOption={(d) => `${d.name} ${d.address && '(' + d.address + ')'}`}
      dataNodeName="trainingCenters"
    />
    <Field
      name="invitedAs"
      component={SelectField}
      label="Invite as"
      options={[
        { title: 'Student', value: 'student' },
        { title: 'Teacher', value: 'teacher' },
        { title: 'Center Incharge', value: 'centerIncharge' }
      ]}
    />
    {formData.values.invitedAs === 'student' && (
      <Field
        name="batchId"
        label="Batch"
        component={SelectQueryField}
        dataNodeName="batches"
        query={BATCH_LISTING}
        displayOption={(b) => `${b.name}`}
      />
    )}

    {formData.status && <ApolloError error={formData.status} />}

    <button className="btn-primary">Save</button>
  </Form>
);

interface ICreateInvitationProps {
  invitation?: IInvitation;
}

const CreateNewInvitation = (props: ICreateInvitationProps) => {
  let initialValues = {
    id: undefined,
    invitedEmail: '',
    invitedAs: 'student',
    validTill: '',
    trainingCenterId: '',
    batchId: ''
  };
  let mutation = CREATE_INVITATION;
  let handleMutation = handleCreateInvitation;

  if (props.invitation) {
    initialValues = {
      id: props.invitation.id,
      invitedEmail: props.invitation.invitedEmail,
      invitedAs: props.invitation.invitedAs,
      validTill: format(new Date(props.invitation.validTill), 'YYYY-MM-DD'),
      trainingCenterId: props.invitation.trainingCenter.id,
      batchId: props.invitation.batch && props.invitation.batch.id
    };
    mutation = UPDATE_INVITATION;
    handleMutation = handleUpdateInvitation;
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

export default CreateNewInvitation;
