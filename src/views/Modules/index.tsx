import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import CreateNewModule from '@src/views/Modules/CreateNew';
import ModuleListing from '@src/views/Modules/Listing';
import ModuleDetails from '@src/views/Modules/ModuleDetails';
import UserLayout from '@src/components/UserLayout';
import './style.scss';

const Modules = () => (
  <UserLayout>
    <div styleName="container">
      <Switch>
        <Route exact path="/courses/:courseId/modules" component={ModuleListing} />
        <Route exact path="/courses/:courseId/modules/new" component={CreateNewModule} />
        <Route exact path="/courses/:courseId/modules/:moduleId" component={ModuleDetails} />
      </Switch>
    </div>
  </UserLayout>
);

export default Modules;
