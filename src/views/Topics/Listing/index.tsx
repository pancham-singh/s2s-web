import * as React from 'react';
import { Component } from 'react';
import { Link } from 'react-router-dom';
import { Query } from 'react-apollo';

import Modal from '@src/components/Modal';
import AddNewItemTile from '@src/components/AddNewItemTile';
import AddTopicForm from '@src/views/Topics/CreateNew';

import TopicTile from '@src/components/CourseTile';
import Loader from '@src/components/Loader';
import ApolloError from '@src/components/ApolloError';

import { ITopic } from '@src/model-types';
import TOPIC_LISTING from '@src/queries/topic-listing.graphql';

import './style.scss';
import { ICourse } from '@src/model-types';
import { RouteComponentProps } from 'react-router';

interface TopicListingProps extends RouteComponentProps<RouteParams> {
  courseId: number | string;
  moduleId: number | string;
  topics: ITopic[];
}

interface RouteParams {
  courseId: number;
  moduleId: number;
}

const routePrefix = (courseId, moduleId) => `/modules/${moduleId}/topics`;

class TopicListing_ extends Component<TopicListingProps> {
  state = { isAddingTopic: false };

  startAddingTopic = () => this.setState({ isAddingTopic: true });
  stopAddingModule = () => this.setState({ isAddingTopic: false });

  render() {
    return (
      <div styleName="container">
        <h1>Topics</h1>

        <Modal isVisible={this.state.isAddingTopic} onClose={this.stopAddingModule}>
          <AddTopicForm {...this.props} />
        </Modal>

        <div styleName="tiles">
          <AddNewItemTile title="Add New Topic" onClick={this.startAddingTopic} />

          {this.props.topics.map((t) => (
            <Link
              styleName="tile"
              key={t.id}
              to={`${routePrefix(this.props.courseId, this.props.moduleId)}/${t.id}`}
            >
              <TopicTile course={t} />
            </Link>
          ))}
        </div>
      </div>
    );
  }
}

const TopicListing = (props: RouteComponentProps<RouteParams>) => (
  <Query query={TOPIC_LISTING} variables={{ moduleId: props.match.params.moduleId }}>
    {({ data, error, loading }) => {
      if (loading) {
        return <Loader isVisible={loading} />;
      }

      if (error) {
        return <ApolloError error={error} />;
      }

      return (
        <TopicListing_
          {...props}
          topics={data.topics}
          moduleId={props.match.params.moduleId}
          courseId={props.match.params.courseId}
        />
      );
    }}
  </Query>
);

export default TopicListing;
