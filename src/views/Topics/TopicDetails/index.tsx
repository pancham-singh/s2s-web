import * as React from 'react';
import { Link } from 'react-router-dom';
import { Query } from 'react-apollo';
import BreadCrumbs from '@src/components/BreadCrumbs';
import TOPIC_DETAILS from '@src/queries/topic-details.graphql';
import TOPIC_LISTING from '@src/queries/topic-listing.graphql';
import UPDATE_TOPIC from '@src/queries/update-topic.graphql';
import DELETE_TOPIC from '@src/queries/delete-topic.graphql';
import DeletePrompt from '@src/components/DeletePrompt';
import Modal from '@src/components/Modal';
import EditForm from '@src/views/Topics/CreateNew';
import Loader from '@src/components/Loader';
import ApolloError from '@src/components/ApolloError';
import TopicTile from '@src/components/CourseTile';
import QuestionListingWithData from '@src/views/Questions/Listing';
import QuestionDetails from '@src/views/Questions/QuestionDetails';
import { ITopic as TopicType } from '@src/model-types';
import './style.scss';
import { RouteComponentProps } from 'react-router';
import { Component } from 'react';
import { IQuestion } from '@src/model-types';

interface TopicDetailsProps extends RouteComponentProps<RouteParams> {
  topic: TopicType;
}
interface RouteParams {
  moduleId: string;
  topicId: string;
}

const deleteMutation = (mutation, variables) =>
  mutation({
    variables,
    update: (cache) => {
      const { topics } = cache.readQuery({ query: TOPIC_LISTING, variables });
      cache.writeQuery({
        query: TOPIC_LISTING,
        variables,
        data: { topics: topics.filter((c) => String(c.id) !== String(variables.id)) }
      });
    }
  });

interface TopicDetailsState {
  isEditing: boolean;
  isDeleting: boolean;
  selectedQuestion?: IQuestion;
}

class TopicDetails extends Component<TopicDetailsProps> {
  state: TopicDetailsState = { isEditing: false, isDeleting: false };

  showDeletePrompt = () => this.setState({ isDeleting: true });
  hideDeletePrompt = () => this.setState({ isDeleting: false });

  showEditForm = () => this.setState({ isEditing: true });
  hideEditForm = () => this.setState({ isEditing: false });

  handleSelectQuestion = (q: IQuestion) =>
    this.state.selectedQuestion && q.id === this.state.selectedQuestion.id
      ? this.setState({ selectedQuestion: null })
      : this.setState({ selectedQuestion: q });

  render() {
    const t = this.props.topic;
    const moduleId = this.props.topic.module.id;
    const courseId = this.props.topic.module.course.id;

    if (!t) {
      return <h1>Topic Not Found</h1>;
    }

    return (
      <div styleName="content">
        <DeletePrompt
          title="Do you really want to delete this topic?"
          subtitle="This will delete the topic, all its questions and everything therein."
          mutation={DELETE_TOPIC}
          isVisible={this.state.isDeleting}
          variables={{ id: this.props.topic.id, moduleId }}
          onDelete={() => this.props.history.push(`/courses/${courseId}/modules/${moduleId}`)}
          onCancel={this.hideDeletePrompt}
          handleMutation={deleteMutation}
        />

        <Modal isVisible={this.state.isEditing} onClose={this.hideEditForm}>
          <EditForm {...this.props} topic={this.props.topic} />
        </Modal>

        <h1 styleName="header">
          {t.name}
          <div styleName="controls">
            <i styleName="edit" title="Edit" onClick={this.showEditForm} />
            <i styleName="delete" title="Delete" onClick={this.showDeletePrompt} />
          </div>
        </h1>

        <div>{t.description}</div>

        <div styleName="questions">
          <div styleName="listing">
            <QuestionListingWithData
              {...this.props}
              onSelect={this.handleSelectQuestion}
              selectedQuestion={this.state.selectedQuestion}
            />
          </div>

          {this.state.selectedQuestion && (
            <div styleName="selected-question-section">
              <QuestionDetails
                questionId={String(this.state.selectedQuestion.id)}
                onDelete={this.handleSelectQuestion}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}

interface TopicProps extends RouteComponentProps<RouteParams> {}

const Topic = (props: TopicProps) => (
  <Query query={TOPIC_DETAILS} variables={{ id: props.match.params.topicId }}>
    {({ loading, error, data }) => {
      const moduleId = props.match.params.moduleId;

      const crumbs = {
        Courses: '/courses'
      };

      if (data && data.topic) {
        const courseId = data.topic.module.course.id;
        const moduleId = data.topic.module.id;

        crumbs[data.topic.module.course.name] = `/courses/${courseId}`;
        crumbs[data.topic.module.name] = `/courses/${courseId}/modules/${moduleId}`;
        crumbs[data.topic.name] = null;
      }

      return (
        <div styleName="container">
          <BreadCrumbs crumbs={crumbs} />

          <Loader isVisible={loading} />

          {error && <ApolloError error={error} />}

          {!loading && !error && <TopicDetails topic={data.topic} {...props} />}
        </div>
      );
    }}
  </Query>
);

export default Topic;
