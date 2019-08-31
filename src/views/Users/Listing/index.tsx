import * as React from 'react';
import { Component } from 'react';
import { Link } from 'react-router-dom';
import { Query } from 'react-apollo';

import Loader from '@src/components/Loader';
import ApolloError from '@src/components/ApolloError';
import Modal from '@src/components/Modal';

import AddUserForm from '@src/views/Users/CreateNew';

import { IUser } from '@src/model-types';
import USER_LISTING from '@src/queries/user-listing.graphql';

import './style.scss';

interface UserListingProps {
  users: IUser[];
}

class UserListing_ extends Component<UserListingProps> {
  state = { isAddingUser: false };

  showAddUserForm = () => this.setState({ isAddingUser: true });
  hideAddUserForm = () => this.setState({ isAddingUser: false });

  render() {
    return (
      <div styleName="container">
        <h1>Users</h1>

        <Modal isVisible={this.state.isAddingUser} onClose={this.hideAddUserForm}>
          <AddUserForm />
        </Modal>

        <div styleName="user-listing">
          <div styleName="add-new-user-btn" onClick={this.showAddUserForm}>
            Add New User
          </div>

          <table styleName="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {this.props.users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.roles.length && u.roles[0].name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

const UserListing = () => (
  <Query query={USER_LISTING}>
    {({ data, error, loading }) => {
      return (
        <div styleName="content">
          <Loader isVisible={loading} />
          {error && <ApolloError error={error} />}
          {!loading && !error && <UserListing_ users={data.users} />}
        </div>
      );
    }}
  </Query>
);

export default UserListing;
