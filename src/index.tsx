/* globals document */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import { ApolloProvider } from 'react-apollo';
import CURRENT_USER from '@src/queries/current-user.graphql';

import ApolloClient from 'apollo-boost';

import App from './views/App';
import { apiUrls } from '@src/config';
import { getToken } from '@src/auth';

const client = new ApolloClient({
  uri: apiUrls.graphql,
  fetchOptions: {
    credentials: 'include'
  },
  request: async (operation) => {
    let token = getToken();

    try {
      const data = operation.getContext().cache.readQuery({ query: CURRENT_USER });
      const user = data.currentUser;

      token = token || user.token;
    } catch (err) {
      /* pass */
    }

    if (token) {
      operation.setContext({
        headers: {
          authorization: `Bearer ${token}`
        }
      });
    }
  },
  onError: ({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      console.log('Graphql Errors', graphQLErrors);
    }

    if (networkError) {
      console.log('Network Error', networkError);
    }
  },
  clientState: {
    defaults: {},
    resolvers: {
      User: {
        token: () => localStorage.getItem('token')
      }
    }
  }
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <Route path="/" component={App} />
    </BrowserRouter>
  </ApolloProvider>,
  document.querySelector('#root')
);
