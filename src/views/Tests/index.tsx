import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import UserLayout from '@src/components/UserLayout';
import TestsListing from '@src/views/Tests/Listing';
import CreateNew from '@src/views/Tests/CreateNew';

import './style.scss';

const Tests = () => (
    <UserLayout>
        <div styleName="container">
            <Switch>
                <Route exact path="/tests" component={TestsListing} />
                <Route exact path="/tests/:testId" component={CreateNew} />

            </Switch>
        </div>
    </UserLayout>
);

export default Tests;
