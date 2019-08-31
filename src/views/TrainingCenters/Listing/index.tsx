import * as React from 'react';
import TC_LISTING from '@src/queries/training-center-listing.graphql';
import { ITrainingCenter, IUser } from '@src/model-types';
import { Query } from 'react-apollo';
import ApolloError from '@src/components/ApolloError';
import Loader from '@src/components/Loader';
import UserLayout from '@src/components/UserLayout';
import { Component } from 'react';
import AddTcForm from '@src/views/TrainingCenters/CreateNew';
import Modal from '@src/components/Modal';
import DELETE_TC from '@src/queries/delete-training-center.graphql';
import DeletePrompt from '@src/components/DeletePrompt';
import './style.scss';
import TrainingCenters from '@src/views/TrainingCenters';

const deleteMutation = (mutation, variables) =>
  mutation({
    variables,
    update: (cache) => {
      const { trainingCenters } = cache.readQuery({ query: TC_LISTING, variables });
      cache.writeQuery({
        query: TC_LISTING,
        variables,
        data: {
          trainingCenters: trainingCenters.filter((c) => String(c.id) !== String(variables.id))
        }
      });
    }
  });

interface ListingProps {
  centers: ITrainingCenter[];
}

class TCListing extends Component<ListingProps> {
  state = { isAdding: false, isDeleting: false, selectedTc: undefined };

  showAddForm = (tc?: ITrainingCenter) => this.setState({ isAdding: true, selectedTc: tc });
  hideAddForm = () => this.setState({ isAdding: false, selectedTc: undefined });

  showDeletePrompt = (tc: ITrainingCenter) => this.setState({ isDeleting: true, selectedTc: tc });
  hideDeletePrompt = () => this.setState({ isDeleting: false, selectedTc: undefined });

  render() {
    const props = this.props;
    return (
      <div styleName="container">
        <h1>Training Centers</h1>

        <Modal isVisible={this.state.isAdding} onClose={this.hideAddForm}>
          <AddTcForm trainingCenter={this.state.selectedTc} />
        </Modal>

        <DeletePrompt
          title="Do you really want to delete this topic?"
          subtitle="This will delete the topic, all its questions and everything therein."
          mutation={DELETE_TC}
          isVisible={this.state.isDeleting}
          variables={{ id: this.state.selectedTc && this.state.selectedTc.id }}
          onDelete={this.hideDeletePrompt}
          onCancel={this.hideDeletePrompt}
          handleMutation={deleteMutation}
        />

        <div styleName="listing">
          <div styleName="add-btn" onClick={() => this.showAddForm()}>
            Create Training Center
          </div>

          {!this.props.centers.length && (
            <div styleName="no-items-msg">No training centers yet</div>
          )}

          {!!this.props.centers.length && (
            <table styleName="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Address</th>
                  <th>PIA</th>
                  <th>In-Charge</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {props.centers.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.name}</td>
                    <td>{c.address}</td>
                    <td>{c.pia && c.pia.name}</td>
                    <td>{Boolean(c.incharges && c.incharges.length) && c.incharges[0].name}</td>
                    <td styleName="actions-col">
                      <i styleName="edit" title="Edit" onClick={() => this.showAddForm(c)} />
                      <i
                        styleName="delete"
                        title="Delete"
                        onClick={() => this.showDeletePrompt(c)}
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

interface Props {
  pia?: string;
}

const TCListingWithData = (props: Props) => (
  <Query query={TC_LISTING}>
    {({ data, loading, error }) => {
      return (
        <div styleName="content">
          <Loader isVisible={loading} />
          {error && <ApolloError error={error} />}
          {!loading && !error && <TCListing centers={data.trainingCenters} />}
        </div>
      );
    }}
  </Query>
);

export default TCListingWithData;
