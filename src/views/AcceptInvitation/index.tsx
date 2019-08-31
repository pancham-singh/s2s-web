import ApolloError from '@src/components/ApolloError';
import Loader from '@src/components/Loader';
import INVITATION_FOR_TOKEN from '@src/queries/invitation-for-token.graphql';
import CURRENT_USER from '@src/queries/current-user.graphql';
import RegisterWithInvite from '@src/views/AcceptInvitation/RegisterWithInvite';
import * as React from 'react';
import { Component } from 'react';
import { Query } from 'react-apollo';
import { RouteComponentProps } from 'react-router';
import './style.scss';

interface IRouteParams {
  token: string;
}

interface IProps extends RouteComponentProps<IRouteParams> {}

class AcceptInvitation extends Component<IProps> {
  public render() {
    return (
      <Query query={INVITATION_FOR_TOKEN} variables={{ token: this.props.match.params.token }}>
        {({ data, error, loading }) => {
          return (
            <div styleName="container">
              <div styleName="content">
                <Loader isVisible={loading} />
                {error && <ApolloError error={error} />}
                {!error &&
                  !loading && (
                    <Query query={CURRENT_USER}>
                      {({ data: userData, loading: loadingUser, error: userError }) => (
                        <div>
                          <Loader isVisible={loadingUser} />
                          <RegisterWithInvite
                            invitation={data.invitationForToken}
                            user={userData.currentUser}
                          />
                        </div>
                      )}
                    </Query>
                  )}
              </div>
            </div>
          );
        }}
      </Query>
    );
  }
}

export default AcceptInvitation;
