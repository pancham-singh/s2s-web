import * as React from 'react';
import { Switch, Route, Link } from 'react-router-dom';

import LoginForm from './Login';
import SignupForm from './Signup';
import './style.scss';
import { RouteComponentProps } from 'react-router';

interface AuthFormsProps extends RouteComponentProps<void> {}

const AuthForms = (props: AuthFormsProps) => {
  const activeForm = /login/.test(props.location.pathname) ? 'login' : 'signup';

  return (
    <div styleName="container">
      <div styleName="content">
        <div styleName="nav-tabs">
          <div styleName={activeForm === 'signup' ? 'active' : 'in-active'}>
            <Link to="/signup">Sign Up</Link>
          </div>
          <div styleName={activeForm === 'login' ? 'active' : 'in-active'}>
            <Link to="/login">Log In</Link>
          </div>
        </div>

        <Switch>
          <Route path="/login" exact component={LoginForm} />
          <Route path="/signup" exact component={SignupForm} />
        </Switch>
      </div>
    </div>
  );
};

export default AuthForms;
