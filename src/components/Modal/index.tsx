import * as React from 'react';
import './style.scss';

interface Props {
  isVisible: boolean;
  children: any;
}

interface Callbacks {
  onClose: () => void;
}

const Modal = (props: Props & Callbacks) => {
  if (!props.isVisible) {
    return null;
  }

  return (
    <div styleName="container">
      <div styleName="content">
        <i styleName="close-modal-btn" onClick={props.onClose} />
        {props.children}
      </div>
    </div>
  );
};

export default Modal;
