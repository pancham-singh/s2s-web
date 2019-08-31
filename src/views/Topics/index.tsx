import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import CreateNewTopic from '@src/views/Topics/CreateNew';
import TopicListing from '@src/views/Topics/Listing';
import TopicDetails from '@src/views/Topics/TopicDetails';
import UserLayout from '@src/components/UserLayout';
import './style.scss';

const Topics = () => {
  const pathPrefix = `/modules/:moduleId/topics`;

  return (
    <UserLayout>
      <div styleName="container">
        <Switch>
          <Route exact path={`${pathPrefix}`} component={TopicListing} />
          <Route exact path={`${pathPrefix}/new`} component={CreateNewTopic} />
          <Route exact path={`${pathPrefix}/:topicId`} component={TopicDetails} />
        </Switch>
      </div>
    </UserLayout>
  );
};

export default Topics;
