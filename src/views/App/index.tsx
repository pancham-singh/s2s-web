import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import ProtectedRoute from '@src/components/ProtectedRoute';
import './style.scss';

import ComingSoon from '@src/components/ComingSoon';
import Loader from '@src/components/Loader';
import CURRENT_USER from '@src/queries/current-user.graphql';
import { Query } from 'react-apollo';

import { loginLocal } from '@src/auth';
import hasRole from '@src/lib/hasRole';
import AuthForms from '@src/views/AuthForms';
import Batches from '@src/views/Batches';
import CourseRoutes from '@src/views/Courses';
import Dashboard from '@src/views/Dashboard';
import Invitations from '@src/views/Invitations';
import ModuleRoutes from '@src/views/Modules';
import QuestionRoutes from '@src/views/Questions';
import TopicRoutes from '@src/views/Topics';
import TrainingCenters from '@src/views/TrainingCenters';
import UsersRoutes from '@src/views/Users';
import AcceptInvitation from '@src/views/AcceptInvitation';
import Assessments from '@src/views/Assessments';
import CreateAssessment from '@src/views/Assessments/CreateNew';

import Tests from '@src/views/Tests';

interface AppProps {}

const App = (props: AppProps) => {
  return (
    <Query query={CURRENT_USER}>
      {({ loading, data, error, client }) => {
        if (loading) {
          return <Loader isVisible={true} />;
        }

        if (error) {
          console.warn(error);
        }

        const currentUser = data && data.currentUser;
        const userHasRole = hasRole(currentUser);

        return (
          <Switch>
            <ProtectedRoute
              path="/login"
              redirectToPath="/dashboard"
              canProceed={!currentUser}
              component={AuthForms}
            />
            <ProtectedRoute
              path="/signup"
              redirectToPath="/dashboard"
              canProceed={!currentUser}
              component={AuthForms}
            />

            <Route
              path="/dashboard"
              render={() => {
                if (!currentUser) {
                  return <Redirect to="/login" />;
                }

                if (userHasRole('admin')) {
                  return <Redirect to="/courses" />;
                }

                if (userHasRole('pia')) {
                  return <Redirect to="/training-centers" />;
                }
                if (userHasRole('student')) {
                  return <Redirect to="/tests" />;
                }

                if (userHasRole('teacher') || userHasRole('centerIncharge')) {
                  return <Redirect to="/batches" />;
                }

                return <ComingSoon />;
              }}
            />

            <ProtectedRoute
              path="/modules/:moduleId/topics"
              redirectToPath="/login"
              canProceed={userHasRole('admin')}
              component={TopicRoutes}
            />

            <ProtectedRoute
              path="/courses/:courseId/modules"
              redirectToPath="/login"
              canProceed={userHasRole('admin')}
              component={ModuleRoutes}
            />

            <ProtectedRoute
              path="/courses"
              redirectToPath="/login"
              canProceed={userHasRole('admin')}
              component={CourseRoutes}
            />

            <ProtectedRoute
              path="/users"
              redirectToPath="/login"
              canProceed={userHasRole('admin')}
              component={UsersRoutes}
            />

            <ProtectedRoute
              path="/training-centers"
              redirectToPath="/login"
              canProceed={userHasRole('admin', 'pia')}
              component={TrainingCenters}
            />

            <ProtectedRoute
              path="/batches"
              redirectToPath="/login"
              canProceed={userHasRole('admin', 'pia', 'teacher', 'centerIncharge')}
              component={Batches}
            />

            <ProtectedRoute
              path="/invitations"
              redirectToPath="/login"
              canProceed={userHasRole('admin', 'pia', 'teacher', 'centerIncharge')}
              component={Invitations}
            />
            <ProtectedRoute
                path="/assessments"
                redirectToPath="/login"
                canProceed={userHasRole('admin', 'pia', 'teacher', 'centerIncharge')}
                component={Assessments}
            />
            <ProtectedRoute
                path="/assessments/new"
                redirectToPath="/login"
                canProceed={userHasRole('admin', 'pia', 'teacher', 'centerIncharge')}
                component={CreateAssessment}
            />
            <ProtectedRoute
                path="/tests"
                redirectToPath="/login"
                canProceed={userHasRole('admin', 'pia', 'teacher', 'centerIncharge', 'student')}
                component={Tests}
            />

            <Route path="/accept-invitation/:token" component={AcceptInvitation} />

            {!currentUser ? (
              <Redirect path="*" exact to="/login" />
            ) : (
              <Redirect path="*" exact to="/dashboard" />
            )}
          </Switch>
        );
      }}
    </Query>
  );
};

export default App;
