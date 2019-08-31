import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import UserLayout from '@src/components/UserLayout';
import TcListing from '@src/views/TrainingCenters/Listing';
import './style.scss';

const TrainingCenters = () => (
  <UserLayout>
    <div styleName="container">
      <Switch>
        <Route exact path="/training-centers" component={TcListing} />
      </Switch>
    </div>
  </UserLayout>
);

export default TrainingCenters;
