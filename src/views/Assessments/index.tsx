import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import UserLayout from '@src/components/UserLayout';
import AssessmentListing from '@src/views/Assessments/Listing';
import CreateAssessment from '@src/views/Assessments/CreateNew';

import './style.scss';

const Assessments = () => (
    <UserLayout>
        <div styleName="container">
            <Switch>
                <Route exact path="/assessments/new" component={CreateAssessment} />

                <Route exact path="/assessments" component={AssessmentListing} />
            </Switch>
        </div>
    </UserLayout>
);

export default Assessments;
