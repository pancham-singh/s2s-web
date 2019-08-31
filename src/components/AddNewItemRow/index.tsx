import * as React from 'react';
import './style.scss';

interface Props {
  title: string;
}
interface Callbacks {
  onClick?: () => void;
}

const AddNewItemRow = (props: Props & Callbacks) => {
  const handleClick = props.onClick || (() => ({}));

  return (
    <div styleName="container" onClick={handleClick}>
      <i styleName="plus-icon" />
      <div styleName="title">{props.title}</div>
    </div>
  );
};

export default AddNewItemRow;
