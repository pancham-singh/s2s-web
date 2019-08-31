import ApolloError from '@src/components/ApolloError';
import DeletePrompt from '@src/components/DeletePrompt';
import Loader from '@src/components/Loader';
import Modal from '@src/components/Modal';
import { IInvitation, IUser } from '@src/model-types';
import INVITATION_LISTING from '@src/queries/invitation-listing.graphql';
import DELETE_INVITATION from '@src/queries/delete-invitation.graphql';
import AddInvitationForm from '@src/views/Invitations/CreateNew';
import displayInvitedAs from '@src/lib/displayInvitedAs';
import { Component } from 'react';
import * as React from 'react';
import { Query } from 'react-apollo';
import './style.scss';

const deleteMutation = (mutation, variables) =>
  mutation({
    variables,
    update: (cache) => {
      const { invitations } = cache.readQuery({ query: INVITATION_LISTING, variables });
      cache.writeQuery({
        query: INVITATION_LISTING,
        variables,
        data: {
          invitations: invitations.filter((c) => String(c.id) !== String(variables.id))
        }
      });
    }
  });

interface IListingProps {
  invitations: IInvitation[];
}

class InvitationListing extends Component<IListingProps> {
  public state = { isAdding: false, isDeleting: false, selectedInvitation: undefined };

  public showAddForm = (invitation?: IInvitation) =>
    this.setState({ isAdding: true, selectedInvitation: invitation });
  public hideAddForm = () => this.setState({ isAdding: false, selectedTc: undefined });

  public showDeletePrompt = (invitation: IInvitation) =>
    this.setState({ isDeleting: true, selectedInvitation: invitation });
  public hideDeletePrompt = () =>
    this.setState({ isDeleting: false, selectedInvitation: undefined });

  public render() {
    const props = this.props;
    return (
      <div styleName="container">
        <h1>Invitations</h1>

        <Modal isVisible={this.state.isAdding} onClose={this.hideAddForm}>
          <AddInvitationForm invitation={this.state.selectedInvitation} />
        </Modal>

        <DeletePrompt
          title="Do you really want to delete this invitation?"
          subtitle="This will delete the invitation."
          mutation={DELETE_INVITATION}
          isVisible={this.state.isDeleting}
          variables={{ id: this.state.selectedInvitation && this.state.selectedInvitation.id }}
          onDelete={this.hideDeletePrompt}
          onCancel={this.hideDeletePrompt}
          handleMutation={deleteMutation}
        />

        <div styleName="listing">
          <div styleName="add-btn" onClick={() => this.showAddForm()}>
            Create Invitation
          </div>

          {!this.props.invitations.length && (
            <div styleName="no-items-msg">No invitationes yet</div>
          )}

          {!!this.props.invitations.length && (
            <table styleName="table">
              <thead>
                <tr>
                  <th>Invited Email</th>
                  <th>Invited As</th>
                  <th>Invited By</th>
                  <th>Valid Till</th>
                  <th>Batch</th>
                  <th>Training Center</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {props.invitations.map((i) => (
                  <tr key={i.id}>
                    <td>{i.invitedEmail}</td>
                    <td>{displayInvitedAs(i.invitedAs)}</td>
                    <td>{i.invitedBy.name}</td>
                    <td>{i.validTill ? new Date(i.validTill).toDateString() : 'Indefinite'}</td>
                    <td>{i.batch && i.batch.name}</td>
                    <td>{i.trainingCenter.name}</td>
                    <td styleName="actions-col">
                      {/* <i styleName="edit" title="Edit" onClick={() => this.showAddForm(i)} /> */}
                      <i
                        styleName="delete"
                        title="Delete"
                        onClick={() => this.showDeletePrompt(i)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }
}

const InvitationsListingWithData = (props) => (
  <Query query={INVITATION_LISTING}>
    {({ data, loading, error }) => {
      return (
        <div styleName="content">
          <Loader isVisible={loading} />
          {error && <ApolloError error={error} />}
          {!loading && !error && <InvitationListing invitations={data.invitations} />}
        </div>
      );
    }}
  </Query>
);

export default InvitationsListingWithData;
