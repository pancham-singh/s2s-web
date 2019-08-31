import * as React from 'react';
import { ApolloError as AE } from 'apollo-client';

import './style.scss';

const ApolloError = ({ error }: { error: AE }) => <div styleName="container">{error.message}</div>;

export default ApolloError;
