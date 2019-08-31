import ApolloError from '@src/components/ApolloError';
import DeletePrompt from '@src/components/DeletePrompt';
import Loader from '@src/components/Loader';
import Modal from '@src/components/Modal';
import {IAssessment, IInvitation, IUser} from '@src/model-types';
import ASSESSMENT_LISTING from '@src/queries/assessment-listing.graphql';
import ASSESSMENT_DELETE from '@src/queries/delete-assessment.graphql';
import AddAssessmentForm from '@src/views/Assessments/CreateNew';

import { Component } from 'react';
import * as React from 'react';
import { Query } from 'react-apollo';
import './style.scss';
import {Link} from 'react-router-dom';

const deleteMutation = (mutation, variables) =>
    mutation({
      variables,
      update: (cache) => {
        const { assessments } = cache.readQuery({ query: ASSESSMENT_LISTING, variables });
        cache.writeQuery({
          query: ASSESSMENT_LISTING,
          variables,
          data: {
            assessments: assessments.filter((c) => String(c.id) !== String(variables.id))
          }
        });
      }
    });


interface IListingProps {
  assessments: IAssessment[];
}
class AssessmentListing extends Component<IListingProps> {
  public state = { isAdding: false, isDeleting: false, selectedAssessment: undefined };

  public showAddForm = (assessment?: IAssessment) =>
        this.setState({ isAdding: true, selectedAssessment: assessment });
  public hideAddForm = () => this.setState({ isAdding: false, selectedTc: undefined });

  public showDeletePrompt = (assessment: IAssessment) =>
        this.setState({ isDeleting: true, selectedAssessment: assessment });
  public hideDeletePrompt = () =>
        this.setState({ isDeleting: false, selectedAssessment: undefined });

  public render() {
    const props = this.props;
    return (
            <div styleName="container">
                <h1>Assessments</h1>

                {/*<Modal isVisible={this.state.isAdding} onClose={this.hideAddForm}>*/}
                    {/*<AddAssessmentForm assessment={this.state.selectedAssessment} />*/}
                {/*</Modal>*/}

                <DeletePrompt
                    title="Do you really want to delete this assessment?"
                    subtitle="This will delete the assessment."
                    mutation={ASSESSMENT_DELETE}
                    isVisible={this.state.isDeleting}
                    variables={{ id: this.state.selectedAssessment && this.state.selectedAssessment.id }}
                    onDelete={this.hideDeletePrompt}
                    onCancel={this.hideDeletePrompt}
                    handleMutation={deleteMutation}
                />

                <div styleName="listing">
                    <Link to="/assessments/new"><div styleName="add-btn">
                        Create Assessment
                    </div>
                    </Link>

                    {!this.props.assessments.length && (
                        <div styleName="no-items-msg">No Assessments yet</div>
                    )}

                    {!!this.props.assessments.length && (
                        <table styleName="table">
                            <thead>
                            <tr>

                                <th>Name</th>
                                {/*<th>Batch</th>*/}
                                <th>Duration</th>
                                <th>Start Date</th>
                                <th>End Date</th>

                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {props.assessments.map((a) => (
                                <tr key={a.id}>
                                    <td>{a.name}</td>
                                    {/*<td>{a.batch}</td>*/}
                                    <td>{a.durationMinutes}</td>
                                    <td>{a.startDate ? new Date(a.startDate).toDateString() : 'Indefinite'}</td>
                                    <td>{a.endDate ? new Date(a.endDate).toDateString() : 'Indefinite'}</td>
                                    <td styleName="actions-col">
                                        {/* <i styleName="edit" title="Edit" onClick={() => this.showAddForm(i)} /> */}
                                        <i
                                            styleName="delete"
                                            title="Delete"
                                            onClick={() => this.showDeletePrompt(a)}
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
const AsessmentListingWithData = (props) => (

    <Query query={ASSESSMENT_LISTING}>
        {({ data, loading, error }) => {
          return (
                <div styleName="content">
                    <Loader isVisible={loading} />
                    {error && <ApolloError error={error} />}
                    {!loading && !error && <AssessmentListing assessments={data.assessments} />}
                </div>
          );
        }}
    </Query>
);

export default AsessmentListingWithData;