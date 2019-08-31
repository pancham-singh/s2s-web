import Input from '@src/components/Form/Input';
import Loader from '@src/components/Loader';
import ANSWERS from '@src/queries/answers-listing.graphql';
import QUESTIONS from '@src/queries/assesment-questions.graphql';
import ASSESSMENT_RESULT from  '@src/queries/assessment-result-details.graphql';

import CREATE_ASSESSMENT_RESULT from '@src/queries/create-assessment-result.graphql';
import { Field, Form, Formik, FormikBag, FormikProps } from 'formik';
import * as React from 'react';
import { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import { Route, Switch } from 'react-router-dom';
import * as yup from 'yup';

import ApolloError from '@src/components/ApolloError';
import { imagePath } from '@src/config';
import { IAnswer, IAssesment, IAssesmentAnswer, IAssesmentTopic, IQuestion } from '@src/model-types';
import QuestionDetails from '@src/views/Questions/QuestionDetails';
import { anySeries } from 'async';
import { RouteComponentProps } from 'react-router';
import { toast } from 'react-toastify';
import './style.scss';

interface IFormData {
  answerId: string;
  question: string;
  assessment: string;
  body: string;
  isCorrect: boolean;
}

interface IQuestionData {
  id: string;
  body: string;
  answers: IAnswer[];
}

interface IFormProps {
  initialValues: IFormData;
  question: IQuestionData;
  onSubmit: (event) => void;
}

const validationSchema = yup.object().shape({
  answerId: yup
        .string()
        .required('Name is required'),
  question: yup.string(),
  assessment: yup.string(),
  isCorrect: yup.boolean()

});

interface RouteParams {
  testId: string;
}
interface TestResult {
  correctCount: number;
  incorrectCount: number;
  completedCount: number;
  pendingCount: number;
  asesssment: IAssesment;
}
interface TestResultProps {
data: TestResult;
}
const TestResult = (props: TestResultProps) => (
    <div>
        <div styleName="answer-list-item">Correct Answers: {props.data.correctCount}</div>
        <div styleName="answer-list-item">Incorrect Answers: {props.data.incorrectCount}</div>
        <div styleName="answer-list-item">Completed Answers:{props.data.completedCount}</div>
        <div styleName="answer-list-item">Pending Answers: {props.data.pendingCount}</div>
    </div>
)

const PostAnswers = (props: IFormProps) => (
    <Mutation mutation={CREATE_ASSESSMENT_RESULT}>
        {(createAssessmentResult, { loading, error }) => (
            <div>
            <Loader isVisible={loading}/>
                <h2>=> {props.question.body}</h2>
            <Formik
        initialValues={props.initialValues}
        onSubmit={(values, actions) => {
          console.log('values' , values);
          props.onSubmit(createAssessmentResult, values, actions);
        }}
        render={({ errors, touched, isSubmitting, values, handleChange }) => (
            <Form>
                <Query query={ANSWERS} variables={{ question: props.question.id }}>
                    {({ data, error, loading }) => {
                      if (loading) {
                        return <Loader isVisible={loading}/>;
                      }
                      if (error) {
                        return <ApolloError error={error}/>;
                      }
                      return (
                            <div>
                                {!loading && !error && data.answers.map((ans) => (
                                    <div styleName="answer-list-item" key={ans.id}>
                                   <label>
                                       <input
                                        key={ans.id}
                                        name="isCorrect"
                                        onChange={(e) => {
                                              values.answer.isCorrect = ans.isCorrect;
                                          values.answer.id = ans.id;
                                          values.answer.body = ans.body;
                                          values.answer.question = props.question.id;
                                        }}
                                        type="radio"
                                        styleName={'checkbox-form-group'}
                                    />
                                       <span> {ans.body}</span>
                                   </label>
                                    </div>
                                ))}
                            </div>
                      );
                    }}
                </Query>
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                    Submit
                </button>
            </Form>
        )}
    />
            </div>)}
 </Mutation>
);
interface QuestionProps extends RouteComponentProps<RouteParams> {
}

class CreateTest extends Component {
  public state = { next:0, qustions: [], answer: {}, currentQuestion: IQuestion, count:0 ,isCorrect:false};
  public questions = [];
  public result = {
      correctCount: 0,
    incorrectCount: 0,
    completedCount: 0,
    pendingCount: 0
  }
  public testName = '';

  public updateResult = (result) =>{
      this.result.pendingCount = (this.questions.length - this.state.next);
      this.result.completedCount = this.state.next;
      this.result.incorrectCount = result.isCorrect ? this.result.incorrectCount :this.result.incorrectCount + 1 ;
      this.result.correctCount = result.isCorrect ? this.result.correctCount + 1 :this.result.correctCount ;
  }

  public handleCreateAssessmentResult = (mutation , values, actions) => {
    console.log('post values===', values);
    this.updateResult({isCorrect:values.answer.isCorrect});
    values.correctCount = this.result.correctCount;
    values.incorrectCount = this.result.incorrectCount;
    values.pendingCount = this.result.pendingCount;
    values.completedCount = this.result.pendingCount;
    actions.setSubmitting(true);
    mutation({
        variables: values,
        update: (cache, { data: { createAssessmentResult: assessmentResult } }) => {
                // const { assessments } = cache.readQuery({ query: ASSESSMENT_LISTING });
                // cache.writeQuery({
                //   query: ASSESSMENT_LISTING,
                //   data: { assessments: assessments.concat    (assessmentResult) }
                // });
          }
      })
            .then((res) => {
              actions.setSubmitting(false);
              actions.resetForm();
              toast('Created new Assessment', { type: 'success' });
                if(this.state.next === this.questions.length) {
                    location.href = `/tests/${this.props.match.params.testId}`;

                }
              this.next();
            })
            .catch((err) => {
              actions.setSubmitting(false);
              actions.setStatus(err);
            });
  }
  private getTests = (questions: []) => {
    this.questions = questions;

    console.log(this.questions);
  }
  private next = () => {
    const size = this.questions.length;
    if (this.state.next <= size) {
        this.setState({
            currentQuestion: this.questions[this.state.next],
            next: this.state.next + 1
          }
            );
      }

  }

  public render() {
    const testId = this.props.match.params.testId;
    const initialValues = {
      answer: {
          assessment: this.props.match.params.testId,
          id: '2',
            question: 0,
            body: '',
            isCorrect: false
          },
      assessment: this.props.match.params.testId,
      correctCount:this.result.correctCount,
      incorrectCount:this.result.incorrectCount,
      completedCount:this.result.completedCount,
      pendingCount:this.result.pendingCount
    };
    return (
            <div styleName="container">
                <div styleName="content">
<Query query={ASSESSMENT_RESULT} variables={{ assessment: testId }}>
    {({ data, loading, error }) => {
        console.log('assessment data',data)
        return (
            <div>
                {!loading && !error && data.assessmentResults.length>0 &&
                <div>
                    <h1>{data.assessmentResults[0].assessment.name}</h1>
                   <TestResult data={data.assessmentResults[0]}/>
                </div>}
                {!loading && !error && data.assessmentResults.length <= 0 &&
                <Query query={QUESTIONS} variables={{ id: testId }}>
                    {({ data, loading, error }) => {
                        return (
                            <div>

                                <Loader isVisible={loading}/>
                                {error && <ApolloError error={error}/>}
                                {!loading && !error &&
                                this.getTests(data.assessment.questions)}
                                {!loading && !error &&
                                <div>
                                    <h1>{data.assessment.name}</h1>
                                    <PostAnswers
                                        initialValues={initialValues}
                                        question={this.state.currentQuestion || data.assessment.questions[0]}
                                        onSubmit={this.handleCreateAssessmentResult}
                                    />
                                </div>

                                }

                            </div>
                        );
                    }}
                </Query>}

            </div>
        );
    }}
</Query>
                </div>
            </div>

    );
  }
}

export default CreateTest;
