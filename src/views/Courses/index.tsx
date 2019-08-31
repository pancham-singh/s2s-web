import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import UserLayout from '@src/components/UserLayout';
import CreateNewCourse from '@src/views/Courses/CreateNew';
import CourseListing from '@src/views/Courses/Listing';
import CourseDetails from '@src/views/Courses/CourseDetails';
import './style.scss';

const Courses = () => (
  <UserLayout>
    <div styleName="container">
      <Switch>
        <Route exact path="/courses" component={CourseListing} />
        <Route exact path="/courses/new" component={CreateNewCourse} />
        <Route exact path="/courses/:courseId" component={CourseDetails} />
      </Switch>
    </div>
  </UserLayout>
);

export default Courses;
