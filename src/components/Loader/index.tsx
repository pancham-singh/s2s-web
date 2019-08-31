import * as React from 'react';
import './style.scss';

const Loader = ({ isVisible }) =>
  !isVisible ? null : (
    <div styleName="full-page-overlay">
      <div styleName="full-page-loader" />
    </div>
  );

export default Loader;
