import * as React from 'react';
import { Component } from 'react';
import { Link } from 'react-router-dom';
import { Query } from 'react-apollo';
import QUESTION_DETAILS from '@src/queries/question-details.graphql';
import QUESTION_LISTING from '@src/queries/question-listing.graphql';
import DELETE_QUESTION from '@src/queries/delete-question.graphql';
import Loader from '@src/components/Loader';
import DeletePrompt from '@src/components/DeletePrompt';
import ApolloError from '@src/components/ApolloError';
import QuestionTile from '@src/components/CourseTile';
import { IQuestion as QuestionType, IQuestion } from '@src/model-types';
import './style.scss';
import { RouteComponentProps } from 'react-router';
import AnswerListing from './Answers/Listing';
import NewAnswerForm from './Answers/CreateNew';
import EditForm from '@src/views/Questions/CreateNew';
import Modal from '@src/components/Modal';

const deleteMutation = (mutation, variables) =>
  mutation({
    variables,
    update: (cache) => {
      const { questions } = cache.readQuery({ query: QUESTION_LISTING, variables });
      cache.writeQuery({
        query: QUESTION_LISTING,
        variables,
        data: { questions: questions.filter((q) => String(q.id) !== String(variables.id)) }
      });

      cache.writeQuery({
        query: QUESTION_DETAILS,
        variables,
        data: { question: null }
      });
    }
  });

interface QuestionDetailsProps {
  question: QuestionType;
}

interface QuestionDetailsCallbacks {
  onDelete: (q: IQuestion) => void;
}

interface QuestionDetailsState {
  isEditing: boolean;
  isDeleting: boolean;
  isAddingAnswer: boolean;
}

class QuestionDetails extends Component<QuestionDetailsProps & QuestionDetailsCallbacks> {
  state: QuestionDetailsState = {
    isEditing: false,
    isDeleting: false,
    isAddingAnswer: false
  };

  startAddingAnswer = () => this.setState({ isAddingAnswer: true });
  stopAddingAnswer = () => this.setState({ isAddingAnswer: false });

  showDeletePrompt = () => this.setState({ isDeleting: true });
  hideDeletePrompt = () => this.setState({ isDeleting: false });

  showEditForm = () => this.setState({ isEditing: true });
  hideEditForm = () => this.setState({ isEditing: false });

  render() {
    const q = this.props.question;
    if (!q) {
      return <h1>Question Not Found</h1>;
    }

    const topicId = q.topic.id;
    const moduleId = q.topic.module.id;

    return (
      <div>
        <DeletePrompt
          title="Do you really want to delete this Question?"
          subtitle="This will delete the question, all its answers and everything therein."
          mutation={DELETE_QUESTION}
          isVisible={this.state.isDeleting}
          variables={{ id: q.id, topicId }}
          onDelete={() => {
            this.hideDeletePrompt();
            this.props.onDelete(q);
          }}
          onCancel={this.hideDeletePrompt}
          handleMutation={deleteMutation}
        />

        <Modal isVisible={this.state.isEditing} onClose={this.hideEditForm}>
          <EditForm
            {...this.props}
            topicId={this.props.question.topic.id}
            question={this.props.question}
          />
        </Modal>

        <h1 styleName="header">
          {q.body}
          <div styleName="controls">
            <i styleName="edit" title="Edit" onClick={this.showEditForm} />
            <i styleName="delete" title="Delete" onClick={this.showDeletePrompt} />
          </div>
        </h1>

        <div styleName="answers">
          <h2 styleName="answers__heading">Answers</h2>

          <button className="btn" onClick={this.startAddingAnswer}>
            Add new Answer
          </button>

          {this.state.isAddingAnswer && (
            <div styleName="new-answer-form">
              <NewAnswerForm question={q} onClose={this.stopAddingAnswer} />
            </div>
          )}

          <AnswerListing answers={q.answers} />
        </div>
      </div>
    );
  }
}

interface QuestionProps {
  questionId: string;
}
interface QuestionCallbacks {
  onDelete: (q: IQuestion) => void;
}

const Question = (props: QuestionProps & QuestionCallbacks) => (
  <div styleName="container">
    <Query query={QUESTION_DETAILS} variables={{ id: props.questionId }}>
      {({ loading, error, data }) => {
        if (loading) {
          return <Loader isVisible />;
        }

        if (error) {
          return <ApolloError error={error} />;
        }

        return <QuestionDetails question={data.question} onDelete={props.onDelete} />;
      }}
    </Query>
  </div>
);

export default Question;
