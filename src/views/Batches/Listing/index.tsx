import ApolloError from '@src/components/ApolloError';
import DeletePrompt from '@src/components/DeletePrompt';
import Loader from '@src/components/Loader';
import Modal from '@src/components/Modal';
import { IBatch, IUser } from '@src/model-types';
import BATCHES_LISTING from '@src/queries/batches-listing.graphql';
import CURRENT_USER from '@src/queries/current-user.graphql';
import DELETE_BATCH from '@src/queries/delete-batch.graphql';
import Batches from '@src/views/Batches';
import AddBatchForm from '@src/views/Batches/CreateNew';
import { Component } from 'react';
import * as React from 'react';
import { Query } from 'react-apollo';
import './style.scss';
import hasRole from '@src/lib/hasRole';

const deleteMutation = (mutation, variables) =>
  mutation({
    variables,
    update: (cache) => {
      const { batches } = cache.readQuery({ query: BATCHES_LISTING, variables });
      cache.writeQuery({
        query: BATCHES_LISTING,
        variables,
        data: {
          batches: batches.filter((c) => String(c.id) !== String(variables.id))
        }
      });
    }
  });

interface ListingProps {
  batches: IBatch[];
}

class BatchListing extends Component<ListingProps> {
  public state = { isAdding: false, isDeleting: false, selectedBatch: undefined };

  public showAddForm = (batch?: IBatch) => this.setState({ isAdding: true, selectedBatch: batch });
  public hideAddForm = () => this.setState({ isAdding: false, selectedTc: undefined });

  public showDeletePrompt = (batch: IBatch) =>
    this.setState({ isDeleting: true, selectedBatch: batch });
  public hideDeletePrompt = () => this.setState({ isDeleting: false, selectedBatch: undefined });

  public render() {
    const props = this.props;
    return (
      <div styleName="container">
        <h1>Batches</h1>

        <Modal isVisible={this.state.isAdding} onClose={this.hideAddForm}>
          <AddBatchForm batch={this.state.selectedBatch} />
        </Modal>

        <DeletePrompt
          title="Do you really want to delete this batch?"
          subtitle="This will delete the batch."
          mutation={DELETE_BATCH}
          isVisible={this.state.isDeleting}
          variables={{ id: this.state.selectedBatch && this.state.selectedBatch.id }}
          onDelete={this.hideDeletePrompt}
          onCancel={this.hideDeletePrompt}
          handleMutation={deleteMutation}
        />

        <div styleName="listing">
          <Query query={CURRENT_USER}>
            {({ data: { currentUser } }) =>
              hasRole(currentUser)('admin', 'pia', 'centerIncharge') && (
                <div styleName="add-btn" onClick={() => this.showAddForm()}>
                  Create Batch
                </div>
              )
            }
          </Query>

          {!this.props.batches.length && <div styleName="no-items-msg">No batches yet</div>}

          {!!this.props.batches.length && (
            <table styleName="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Course</th>
                  <th>Starts on</th>
                  <th>Ends on</th>
                  <th>Center</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {props.batches.map((b) => (
                  <tr key={b.id}>
                    <td>{b.id}</td>
                    <td>{b.name}</td>
                    <td>{b.course.name}</td>
                    <td>{new Date(b.startDate).toDateString()}</td>
                    <td>{new Date(b.endDate).toDateString()}</td>
                    <td>{b.trainingCenter.name}</td>
                    <td styleName="actions-col">
                      <i styleName="edit" title="Edit" onClick={() => this.showAddForm(b)} />
                      <i
                        styleName="delete"
                        title="Delete"
                        onClick={() => this.showDeletePrompt(b)}
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

interface IProps {
  pia?: string;
}

const BatchesListingWithData = (props: IProps) => (
  <Query query={BATCHES_LISTING}>
    {({ data, loading, error }) => {
      return (
        <div styleName="content">
          <Loader isVisible={loading} />
          {error && <ApolloError error={error} />}
          {!loading && !error && <BatchListing batches={data.batches} />}
        </div>
      );
    }}
  </Query>
);

export default BatchesListingWithData;
