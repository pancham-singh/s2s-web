import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import UserLayout from '@src/components/UserLayout';
import UserListing from '@src/views/Users/Listing';
import './style.scss';

const Users = () => (
  <UserLayout>
    <div styleName="container">
      <Switch>
        <Route exact path="/users" component={UserListing} />
      </Switch>
    </div>
  </UserLayout>
);

export default Users;
