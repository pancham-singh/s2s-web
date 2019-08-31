import * as React from 'react';
import { Component } from 'react';
import { Link } from 'react-router-dom';
import { Query } from 'react-apollo';

import CourseTile from '@src/components/CourseTile';
import Loader from '@src/components/Loader';
import ApolloError from '@src/components/ApolloError';
import Modal from '@src/components/Modal';
import AddNewItemTile from '@src/components/AddNewItemTile';

import AddCourseForm from '@src/views/Courses/CreateNew';

import { ICourse } from '@src/model-types';
import COURSE_LISTING from '@src/queries/course-listing.graphql';

import './style.scss';

interface CourseListingProps {
  courses: ICourse[];
}

class CourseListing_ extends Component<CourseListingProps> {
  state = { isAddingCourse: false };

  showAddCourseForm = () => this.setState({ isAddingCourse: true });
  hideAddCourseForm = () => this.setState({ isAddingCourse: false });

  render() {
    return (
      <div styleName="container">
        <h1>Courses</h1>

        <Modal isVisible={this.state.isAddingCourse} onClose={this.hideAddCourseForm}>
          <AddCourseForm />
        </Modal>

        <div styleName="tiles">
          <AddNewItemTile title="Add New Course" onClick={this.showAddCourseForm} />

          {this.props.courses.map((c) => (
            <Link styleName="tile" key={c.id} to={`/courses/${c.id}`}>
              <CourseTile course={c} />
            </Link>
          ))}
        </div>
      </div>
    );
  }
}

const CourseListing = () => (
  <Query query={COURSE_LISTING}>
    {({ data, error, loading }) => {
      if (loading) {
        return <Loader isVisible={loading} />;
      }

      if (error) {
        return <ApolloError error={error} />;
      }

      return <CourseListing_ courses={data.courses} />;
    }}
  </Query>
);

export default CourseListing;
