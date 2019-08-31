import { loginLocal } from '@src/auth';
import ApolloError from '@src/components/ApolloError';
import InputField from '@src/components/Form/Input';
import { Redirect } from 'react-router-dom';
import displayInvitedAs from '@src/lib/displayInvitedAs';
import { IInvitation, IUser } from '@src/model-types';
import CURRENT_USER from '@src/queries/current-user.graphql';
import REGISTER_WITH_TOKEN from '@src/queries/register-with-invitation-token.graphql';
import ACCEPT_INVITATION from '@src/queries/accept-invitation.graphql';
import { Field, Form, Formik, FormikBag, FormikProps } from 'formik';
import Loader from '@src/components/Loader';
import ApolloError from '@src/components/ApolloError';
import { Component } from 'react';
import * as React from 'react';
import { Mutation } from 'react-apollo';
import * as yup from 'yup';
import './style.scss';
import hasRole from '@src/lib/hasRole';

interface IFormData {
  name: string;
  email: string;
  password: string;
}

interface IProps {
  invitation: IInvitation;
  user: IUser;
}

const FinishRegistrationForm = (formData: FormikProps<IFormData>) => (
  <Form styleName="form-container">
    <Field name="name" label="Name" component={InputField} />
    <Field name="email" label="Email" type="email" component={InputField} disabled />
    <Field name="password" label="New Password" type="password" component={InputField} />

    {formData.status && <ApolloError error={formData.status} />}

    <button className="btn-primary">Finish Registration</button>
  </Form>
);

class RegisterWithInvite extends Component<IProps> {
  public validationSchema = yup.object().shape({
    name: yup.string(),
    password: yup
      .string()
      .required('Password is required')
      .min(6, 'Password should at least be 6 characters long')
  });

  public handleAcceptInvitation = (mutationFunc) => () => {
    mutationFunc({
      variables: { token: this.props.invitation.token },

      update: (cache, { data: { acceptInvitation } }) => {
        cache.writeQuery({
          query: CURRENT_USER,
          data: {
            currentUser: {
              ...acceptInvitation.user,
              token: acceptInvitation.token
            }
          }
        });
      }
    }).then((res) => {
      loginLocal(res.data.acceptInvitation.token);
    });
  };

  public handleRegister = (mutationFunc) => (
    values: FormData,
    { setStatus, setSubmitting, resetForm }: FormikBag<FormData, {}>
  ) => {
    setSubmitting(true);

    mutationFunc({
      variables: values,

      update: (cache, { data: { registerWithInvitationToken } }) => {
        cache.writeQuery({
          query: CURRENT_USER,
          data: {
            currentUser: {
              ...registerWithInvitationToken.user,
              token: registerWithInvitationToken.token
            }
          }
        });
      }
    })
      .then((res) => {
        loginLocal(res.data.registerWithInvitationToken.token);
      })
      .catch((err) => {
        setSubmitting(false);
        setStatus(err);
      });
  };

  public render() {
    const { invitation: invite, user } = this.props;

    if (!invite || (user && user.email !== invite.invitedEmail)) {
      return (
        <div styleName="error-msg">
          <h1>Oops! You are not invited!</h1>
          <p>
            Either your invitation has expired, or it has been revoked. Please contact the person
            who sent you the invitation for clarification
          </p>
        </div>
      );
    }

    if (user && hasRole(user)(invite.invitedAs)) {
      return <Redirect to="/dashboard" />;
    }

    return (
      <div>
        <h1>Welcome to Skill2Skills!</h1>
        <p>
          You have been invited to join Skill2Skills platform by{' '}
          <b>
            {invite.invitedBy.name}({invite.invitedBy.email})
          </b>
          to join as a <b>{displayInvitedAs(invite.invitedAs)}</b>.
        </p>
        <p>
          You are invited to join training center <b>{invite.trainingCenter.name}</b>.
        </p>

        {!this.props.user && (
          <div>
            <p>
              To accept the invitation, you need to register with Skill2Skills. Your username will
              be
              <b> {invite.invitedEmail}</b>. Please enter your password in the field below, and
              click on
              <i>Register</i> button to finish registration.
            </p>
            <Mutation mutation={REGISTER_WITH_TOKEN}>
              {(mutationFunc, { loading, error }) => (
                <Formik
                  initialValues={{
                    token: invite.token,
                    email: invite.invitedEmail,
                    name: '',
                    password: ''
                  }}
                  validationSchema={this.validationSchema}
                  onSubmit={this.handleRegister(mutationFunc)}
                  render={FinishRegistrationForm}
                />
              )}
            </Mutation>
          </div>
        )}

        {this.props.user && (
          <Mutation mutation={ACCEPT_INVITATION}>
            {(mutationFunc, { loading, error }) => (
              <div>
                <div className="btn-primary" onClick={this.handleAcceptInvitation(mutationFunc)}>
                  Accept new role as a {displayInvitedAs(invite.invitedAs)}
                </div>
                <Loader isVisible={loading} />
                {error && <ApolloError error={error} />}
              </div>
            )}
          </Mutation>
        )}
      </div>
    );
  }
}

export default RegisterWithInvite;
