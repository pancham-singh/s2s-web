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
class TestsListing extends Component<IListingProps> {
    public state = { isAdding: false, isDeleting: false, selectedAssessment: undefined };
    public render() {
        const props = this.props;
        return (
            <div styleName="container">
                <h1>Tests</h1>
                <div styleName="listing">

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
                                        <a href={`tests/${a.id}`}>
                                        <i
                                            styleName="edit"
                                            title="Start Test"
                                        />
                                        </a>
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
const TestsListingWithData = (props) => (
    <Query query={ASSESSMENT_LISTING}>
        {({ data, loading, error }) => {
            return (
                <div styleName="content">
                    <Loader isVisible={loading} />
                    {error && <ApolloError error={error} />}
                    {!loading && !error && <TestsListing assessments={data.assessments} />}
                </div>
            );
        }}
    </Query>
);

export default TestsListingWithData;