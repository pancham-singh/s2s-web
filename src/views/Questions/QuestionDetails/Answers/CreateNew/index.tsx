import * as React from 'react';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { Formik, Form, Field, FieldArray, FormikBag, FormikProps } from 'formik';
import { Mutation } from 'react-apollo';
import { IAnswer } from '@src/model-types';
import QUESTION_DETAILS from '@src/queries/question-details.graphql';
import CREATE_ANSWER from '@src/queries/create-answer.graphql';
import ApolloError from '@src/components/ApolloError';
import InputField from '@src/components/Form/Input';
import AttachmentsFieldArray from '@src/components/AttachmentsFieldArray';
import SelectField from '@src/components/Form/Select';
import './style.scss';
import { RouteComponentProps } from 'react-router';
import { IQuestion } from '@src/model-types';

interface FormData {
  body: string;
  isCorrect: boolean;
  questionId: number | string;
  attachments: Array<{ url: string; type: 'image' }>;
}

const handleSubmit = (mutation) => (
  values: FormData,
  { setStatus, setSubmitting, resetForm }: FormikBag<FormData, {}>
) => {
  setSubmitting(true);

  mutation({
    variables: values,
    update: (cache, { data: { createAnswer } }) => {
      const { question } = cache.readQuery({
        query: QUESTION_DETAILS,
        variables: { id: values.questionId }
      });

      cache.writeQuery({
        query: QUESTION_DETAILS,
        variables: { id: values.questionId },
        data: { question: { ...question, answers: (question.answers || []).concat(createAnswer) } }
      });
    }
  })
    .then((res) => {
      setSubmitting(false);
      resetForm();

      toast('Created new answer!', { type: 'success' });
    })
    .catch((err) => {
      setSubmitting(false);
      setStatus(err);
    });
};

const validationSchema = yup.object().shape({
  body: yup.string().required('Answer body is required'),
  isCorrect: yup.boolean().default(false),
  attachments: yup.array().of(
    yup.object().shape({
      type: yup
        .string()
        .oneOf(['image'])
        .required(),
      url: yup
        .string()
        .url('Attachment must a valid URL to an image')
        .required('Attachment URL is required')
    })
  ),
  questionId: yup.string().required('Question ID can not be empty')
});

interface InnerFormProps {
  formData: FormikProps<FormData>;
  onClose: () => void;
}

const InnerForm = ({ formData, onClose }: InnerFormProps) => (
  <Form styleName="form-container">
    <Field name="questionId" component="input" type="hidden" />
    <Field name="body" label="Answer Body" component={InputField} />
    <Field
      name="isCorrect"
      label="Is correct answer?"
      type="checkbox"
      component={InputField}
      classNames={{ wrapper: 'checkbox-form-group' }}
    />
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

    {formData.status && <ApolloError error={formData.status} />}

    <button styleName="form-btn" className="btn-primary">
      Create
    </button>
    <button styleName="form-btn" className="btn-danger" type="button" onClick={onClose}>
      Close
    </button>
  </Form>
);

interface CreateNewAnswerProps {
  question: IQuestion;
  onClose: () => void;
}

const CreateNewAnswer = (props: CreateNewAnswerProps) => (
  <Mutation mutation={CREATE_ANSWER}>
    {(createAnswer, { loading, error }) => (
      <Formik
        initialValues={{
          body: '',
          isCorrect: false,
          questionId: props.question.id,
          attachments: []
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit(createAnswer)}
        render={(formProps: FormikProps<FormData>) => (
          <InnerForm formData={formProps} onClose={props.onClose} />
        )}
      />
    )}
  </Mutation>
);

export default CreateNewAnswer;
