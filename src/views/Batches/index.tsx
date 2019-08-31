import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import UserLayout from '@src/components/UserLayout';
import BatchesListing from '@src/views/Batches/Listing';
import './style.scss';

const Batches = () => (
  <UserLayout>
    <div styleName="container">
      <Switch>
        <Route exact path="/batches" component={BatchesListing} />
      </Switch>
    </div>
  </UserLayout>
);

export default Batches;
