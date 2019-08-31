import * as React from 'react';
import { Component } from 'react';
import { Query } from 'react-apollo';
import { Link } from 'react-router-dom';

import AddNewItemRow from '@src/components/AddNewItemRow';
import ApolloError from '@src/components/ApolloError';
import Loader from '@src/components/Loader';
import Modal from '@src/components/Modal';
import AddQuestionForm from '@src/views/Questions/CreateNew';

import { IQuestion } from '@src/model-types';
import QUESTION_LISTING from '@src/queries/question-listing.graphql';

import { RouteComponentProps } from 'react-router';
import './style.scss';

interface IQuestionListingProps {
  topicId: string;
  questions: IQuestion[];
  selectedQuestion?: IQuestion;
}

interface IQuestionListingCallbacks {
  onSelect: (q: IQuestion) => void;
}

interface RouteParams {
  topicId: string;
}

const routePrefix = (topicId) => `/topics/${topicId}/questions`;

class QuestionListing extends Component<IQuestionListingProps & IQuestionListingCallbacks> {
  public state = { isAddingQuestion: false };

  public startAddingQuestion = () => this.setState({ isAddingQuestion: true });
  public stopAddingQuestion = () => this.setState({ isAddingQuestion: false });

  public render() {
    return (
      <div styleName="container">
        <h1>Questions</h1>

        <Modal isVisible={this.state.isAddingQuestion} onClose={this.stopAddingQuestion}>
          <AddQuestionForm topicId={this.props.topicId} />
        </Modal>

        <ul styleName="listing">
          <AddNewItemRow title="Add new Question" onClick={this.startAddingQuestion} />

          {this.props.questions.map((q) => (
            <li
              key={q.id}
              styleName={
                this.props.selectedQuestion && q.id === this.props.selectedQuestion.id
                  ? 'selected-question-list-item'
                  : 'question-list-item'
              }
              onClick={() => this.props.onSelect(q)}
            >
              {q.body}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

interface IProps extends RouteComponentProps<RouteParams> {
  selectedQuestion?: IQuestion;
}
interface ICallbacks extends IQuestionListingCallbacks {
  onSelect: (q: IQuestion) => void;
}

const QuestionListingWithData = (props: IProps & ICallbacks) => (
  <Query query={QUESTION_LISTING} variables={{ topicId: props.match.params.topicId }}>
    {({ data, error, loading }) => {
      if (loading) {
        return <Loader isVisible={loading} />;
      }

      if (error) {
        return <ApolloError error={error} />;
      }

      return (
        <QuestionListing
          questions={data.questions}
          topicId={props.match.params.topicId}
          onSelect={props.onSelect}
          selectedQuestion={props.selectedQuestion}
        />
      );
    }}
  </Query>
);

export default QuestionListingWithData;
