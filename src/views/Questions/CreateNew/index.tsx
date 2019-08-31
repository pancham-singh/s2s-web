import * as React from 'react';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { Formik, Form, Field, FieldArray, FormikBag, FormikProps } from 'formik';
import { Mutation } from 'react-apollo';
import { IQuestion } from '@src/model-types';
import QUESTION_DETAILS from '@src/queries/question-details.graphql';
import QUESTION_LISTING from '@src/queries/question-listing.graphql';
import CREATE_QUESTION from '@src/queries/create-question.graphql';
import UPDATE_QUESTION from '@src/queries/update-question.graphql';
import ApolloError from '@src/components/ApolloError';
import InputField from '@src/components/Form/Input';
import AttachmentsFieldArray from '@src/components/AttachmentsFieldArray';
import AnswersFieldArray from '@src/components/AnswersFieldArray';
import SelectField from '@src/components/Form/Select';
import AddNewItemRow from '@src/components/AddNewItemRow';
import './style.scss';
import { RouteComponentProps } from 'react-router';

interface FormData {
  body: string;
  type: 'theory' | 'practical';
  points: number;
  topicId: string;
  attachments: Array<{ url: string; type: 'image' }>;
  answers: Array<{
    body: string;
    isCorrect: boolean;
    attachments: Array<{ url: string; type: 'image' }>;
  }>;
}

interface RouteParams {
  topicId: string;
}

const handleCreate = (mutation) => (
  values: FormData,
  { setStatus, setSubmitting, resetForm }: FormikBag<FormData, {}>
) => {
  setSubmitting(true);

  mutation({
    variables: values,
    update: (cache, { data: { createQuestion } }) => {
      const { questions } = cache.readQuery({
        query: QUESTION_LISTING,
        variables: { topicId: values.topicId }
      });
      cache.writeQuery({
        query: QUESTION_LISTING,
        variables: { topicId: values.topicId },
        data: { questions: questions.concat(createQuestion) }
      });
    }
  })
    .then((res) => {
      setSubmitting(false);
      resetForm();

      toast('Created new question!', { type: 'success' });
    })
    .catch((err) => {
      setSubmitting(false);
      setStatus(err);
    });
};

const handleUpdate = (mutation) => (
  variables: FormData,
  { setStatus, setSubmitting, resetForm }: FormikBag<FormData, {}>
) => {
  setSubmitting(true);

  // remove __typename field because graphql won't accept it on the server
  const removeApollosBullshit = (x: any) =>
    Object.keys(x).reduce((accum, key) => {
      if (key !== '__typename') {
        accum[key] = x[key];
      }

      return accum;
    }, {});

  variables.answers = (variables.answers || []).map((a) => {
    a = removeApollosBullshit(a);
    a.attachments = (a.attachments || []).map(removeApollosBullshit);

    return a;
  });
  variables.attachments = (variables.attachments || []).map(removeApollosBullshit);

  mutation({
    variables,
    update: (cache, { data: { updateQuestion } }) => {
      const { question: oldQuestion } = cache.readQuery({ query: QUESTION_DETAILS, variables });
      const question = { ...oldQuestion, ...updateQuestion };

      cache.writeQuery({
        query: QUESTION_DETAILS,
        variables,
        data: { question }
      });
    }
  })
    .then((res) => {
      setSubmitting(false);

      toast('Successfully updated question!', { type: 'success' });
    })
    .catch((err) => {
      setSubmitting(false);
      setStatus(err);
    });
};

const attachmentsSchema = yup
  .array()
  .of(
    yup.object().shape({
      type: yup
        .string()
        .oneOf(['image'])
        .required(),
      url: yup.string().required('Required')
    })
  )
  .nullable(true);

const validationSchema = yup.object().shape({
  body: yup.string().required('Question body is required'),
  type: yup
    .string()
    .oneOf(['theory', 'practical'])
    .required('Question type is required'),
  points: yup
    .number()
    .required('Question points are required')
    .min(0),
  attachments: attachmentsSchema,
  topicId: yup.string().required('Topic ID can not be empty'),
  answers: yup.array().of(
    yup.object().shape({
      body: yup.string().required('Answer body is required'),
      isCorrect: yup.boolean(),
      attachments: attachmentsSchema
    })
  )
});

const InnerForm = (formData: FormikProps<FormData>) => (
  <Form styleName="form-container">
    <h1>Question</h1>

    <Field name="topicId" component="input" type="hidden" />
    <Field name="body" label="Question Body" component={InputField} />
    <Field
      name="type"
      label="Type of Question"
      component={SelectField}
      options={[{ title: 'Practical', value: 'practical' }, { title: 'Theory', value: 'theory' }]}
    />
    <Field name="points" label="Question Points" type="number" component={InputField} />
    <FieldArray
      name="attachments"
      render={(ops) => (
        <AttachmentsFieldArray
          values={formData.values.attachments}
          name="attachments"
          fieldArrayOps={ops}
        />
      )}
    />

    <label className="label">Answers</label>
    <FieldArray
      name="answers"
      render={(ops) => (
        <AnswersFieldArray values={formData.values.answers} name="answers" fieldArrayOps={ops} />
      )}
    />

    {formData.status && <ApolloError error={formData.status} />}

    <button className="btn-primary">Save</button>
  </Form>
);

interface Props {
  topicId: string;
  question?: IQuestion;
}

const CreateNewQuestion = (props: Props) => {
  const initialValues = props.question
    ? {
        id: props.question.id,
        body: props.question.body,
        points: props.question.points,
        type: props.question.type,
        topicId: props.question.topic.id,
        attachments: props.question.attachments,
        answers: props.question.answers
      }
    : {
        body: '',
        points: 0,
        type: 'theory',
        topicId: props.topicId,
        attachments: [],
        answers: []
      };
  const handleMutation = props.question ? handleUpdate : handleCreate;

  return (
    <Mutation mutation={props.question ? UPDATE_QUESTION : CREATE_QUESTION}>
      {(mutation, { loading, error }) => (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleMutation(mutation)}
          render={InnerForm}
        />
      )}
    </Mutation>
  );
};

export default CreateNewQuestion;
