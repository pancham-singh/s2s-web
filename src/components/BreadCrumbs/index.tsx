import * as React from 'react';
import { Link } from 'react-router-dom';
import './style.scss';

interface Props {
  crumbs: { [title: string]: string };
}

const BreadCrumbs = (props: Props) => {
  const crumbs = Object.entries(props.crumbs);

  return (
    <div styleName="container">
      {crumbs.map(([title, href], index) => (
        <span key={title}>
          {href && (
            <span>
              <Link styleName="crumb" to={href}>
                {title}
              </Link>
              <span> / </span>
            </span>
          )}

          {!href && <span styleName="dead-crumb">{title}</span>}
        </span>
      ))}
    </div>
  );
};

export default BreadCrumbs;
