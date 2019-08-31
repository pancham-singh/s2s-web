import * as React from 'react';
import Loader from '@src/components/Loader';
import { Mutation } from 'react-apollo';
import Modal from '@src/components/Modal';
import './style.scss';

interface Props {
  isVisible: boolean;
  mutation: any;
  variables: any;
  title: string;
  subtitle: string;
}

interface Callbacks {
  onCancel: () => void;
  onDelete: () => void;
  handleMutation: (mutationFunc: any, variables: any) => any;
}

const DeletePrompt = (props: Props & Callbacks) => (
  <Mutation mutation={props.mutation}>
    {(mutation, { loading, error }) => (
      <Modal isVisible={props.isVisible} onClose={loading ? () => ({}) : props.onCancel}>
        <div styleName="delete-prompt">
          <Loader isVisible={loading} />

          <div styleName="delete-prompt-title">{props.title}</div>
          <div styleName="delete-prompt-subtitle">{props.subtitle}</div>

          <div styleName="delete-prompt-btns">
            <button
              styleName="cancel-prompt-btn"
              type="button"
              onClick={props.onCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              styleName="delete-prompt-delete-btn"
              type="button"
              onClick={() => props.handleMutation(mutation, props.variables).then(props.onDelete)}
              disabled={loading}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    )}
  </Mutation>
);

export default DeletePrompt;
