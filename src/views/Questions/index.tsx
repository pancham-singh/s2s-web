import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import CreateNewQuestion from '@src/views/Questions/CreateNew';
import QuestionListingWithData from '@src/views/Questions/Listing';
import QuestionDetails from '@src/views/Questions/QuestionDetails';
import UserLayout from '@src/components/UserLayout';
import './style.scss';

const Questions = () => {
  const pathPrefix = `/topics/:topicId/questions`;

  return (
    <UserLayout>
      <div styleName="container">
        <Switch>
          <Route exact path={`${pathPrefix}`} component={QuestionListingWithData} />
          <Route exact path={`${pathPrefix}/new`} component={CreateNewQuestion} />
          <Route exact path={`${pathPrefix}/:questionId`} component={QuestionDetails} />
        </Switch>
      </div>
    </UserLayout>
  );
};

export default Questions;
