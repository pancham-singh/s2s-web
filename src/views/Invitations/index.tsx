import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import UserLayout from '@src/components/UserLayout';
import InvitationListing from '@src/views/Invitations/Listing';
import './style.scss';

const Invitations = () => (
  <UserLayout>
    <div styleName="container">
      <Switch>
        <Route exact path="/invitations" component={InvitationListing} />
      </Switch>
    </div>
  </UserLayout>
);

export default Invitations;
