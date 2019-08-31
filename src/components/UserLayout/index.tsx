import * as React from 'react';
import { ReactChildren, ReactChild } from 'react';
import { Query } from 'react-apollo';
import { NavLink } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import './style.scss';
import { logoutLocal } from '@src/auth';
import CURRENT_USER from '@src/queries/current-user.graphql';
import hasRole from '@src/lib/hasRole';
import { IUser } from '@src/model-types';
import { ApolloQueryResult } from 'apollo-boost';
import Loader from '@src/components/Loader';
import ApolloError from '@src/components/ApolloError';

interface UserLayoutProps {
  children: ReactChildren | ReactChild;
}

const handleLogout = (client) => () => {
  client.resetStore();
  logoutLocal();
};

const UserLayout = (props: UserLayoutProps) => (
  <div styleName="container">
    <Query query={CURRENT_USER}>
      {({ client, loading, error, data: { currentUser } }) => {
        if (loading) {
          return <Loader isVisible />;
        }

        if (error) {
          return <ApolloError error={error} />;
        }

        const userHasRole = hasRole(currentUser as IUser);

        return (
          <nav styleName="top-navbar">
            <h2 styleName="brand">
              <NavLink to="/dashboard">Skill2Skills</NavLink>
            </h2>

            {userHasRole('admin') && (
              <NavLink styleName="nav-link" to="/courses">
                Courses
              </NavLink>
            )}

            {userHasRole('admin') && (
              <NavLink styleName="nav-link" to="/users">
                Users
              </NavLink>
            )}

            {userHasRole('admin', 'pia') && (
              <NavLink styleName="nav-link" to="/training-centers">
                Training Centers
              </NavLink>
            )}

            {userHasRole('admin', 'pia', 'centerIncharge', 'teacher') && (
              <NavLink styleName="nav-link" to="/batches">
                Batches
              </NavLink>
            )}

            {userHasRole('admin', 'pia', 'centerIncharge', 'teacher') && (
              <NavLink styleName="nav-link" to="/invitations">
                Invitations
              </NavLink>
            )}
              {userHasRole('admin', 'pia', 'centerIncharge', 'teacher') && (
                  <NavLink styleName="nav-link" to="/assessments">
                      Assessments
                  </NavLink>
              )}
              {userHasRole('admin', 'pia', 'centerIncharge', 'teacher', 'student') && (
                  <NavLink styleName="nav-link" to="/tests">
                      Tests
                  </NavLink>
              )}
            <div styleName="fly-right">
              <span styleName="email">{currentUser.email}</span>
              <a styleName="logout" onClick={handleLogout(client)}>
                Logout
              </a>
            </div>
          </nav>
        );
      }}
    </Query>

    <ToastContainer
      position="bottom-center"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnVisibilityChange
      draggable
      pauseOnHover
    />

    <div styleName="content">{props.children}</div>
  </div>
);

export default UserLayout;
