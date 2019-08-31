import * as React from 'react';
import { Component } from 'react';
import { Link } from 'react-router-dom';
import { Query } from 'react-apollo';
import { RouteComponentProps } from 'react-router';

import { Mutation } from 'react-apollo';
import Modal from '@src/components/Modal';
import AddCourseForm from '@src/views/Courses/CreateNew';
import COURSE_LISTING from '@src/queries/course-listing.graphql';
import COURSE_DETAILS from '@src/queries/course-details.graphql';
import DELETE_COURSE from '@src/queries/delete-course.graphql';
import DeletePrompt from '@src/components/DeletePrompt';
import EditCourseForm from '@src/views/Courses/CreateNew';
import Loader from '@src/components/Loader';
import ApolloError from '@src/components/ApolloError';
import CourseTile from '@src/components/CourseTile';
import { ICourse as CourseType } from '@src/model-types';
import './style.scss';
import ModuleListing from '@src/views/Modules/Listing';
import BreadCrumbs from '@src/components/BreadCrumbs';

interface RouteParams {
  courseId: number;
}

interface CourseDetailsProps extends RouteComponentProps<RouteParams> {
  course: CourseType;
}

const deleteCourseMutation = (mutation, variables) =>
  mutation({
    variables,
    update: (cache) => {
      const { courses } = cache.readQuery({ query: COURSE_LISTING });
      cache.writeQuery({
        query: COURSE_LISTING,
        data: { courses: courses.filter((c) => String(c.id) !== String(variables.id)) }
      });
    }
  });

class CourseDetails extends Component<CourseDetailsProps> {
  state = { isEditingCourse: false, isDeleting: false };

  showDeletePrompt = () => this.setState({ isDeleting: true });
  hideDeletePrompt = () => this.setState({ isDeleting: false });

  showEditCourseForm = () => this.setState({ isEditingCourse: true });
  hideEditCourseForm = () => this.setState({ isEditingCourse: false });

  render() {
    const c = this.props.course;

    if (!this.props.course) {
      return <h1>Course Not Found</h1>;
    }

    return (
      <div styleName="content">
        <DeletePrompt
          title="Do you really want to delete this Course?"
          subtitle="This will delete the course, all its modules and topics and everything therein."
          mutation={DELETE_COURSE}
          isVisible={this.state.isDeleting}
          variables={{ id: this.props.course.id }}
          onDelete={() => this.props.history.push('/courses')}
          onCancel={this.hideDeletePrompt}
          handleMutation={deleteCourseMutation}
        />

        <Modal isVisible={this.state.isEditingCourse} onClose={this.hideEditCourseForm}>
          <EditCourseForm course={this.props.course} />
        </Modal>

        <h1 styleName="header">
          {c.name}
          <div styleName="controls">
            <i styleName="edit" title="Edit" onClick={this.showEditCourseForm} />
            <i styleName="delete" title="Delete" onClick={this.showDeletePrompt} />
          </div>
        </h1>

        <div>{c.description}</div>

        <ModuleListing {...this.props} />
      </div>
    );
  }
}

interface CourseProps extends RouteComponentProps<RouteParams> {}

const Course = (props: CourseProps) => (
  <Query query={COURSE_DETAILS} variables={{ id: props.match.params.courseId }}>
    {({ loading, error, data }) => {
      const crumbs = { Courses: '/courses' };

      if (data && data.course) {
        crumbs[data.course.name] = null;
      }

      return (
        <div styleName="container">
          <BreadCrumbs crumbs={crumbs} />

          <Loader isVisible={loading} />

          {error && <ApolloError error={error} />}
          {!loading && !error && <CourseDetails course={data.course} {...props} />}
        </div>
      );
    }}
  </Query>
);

export default Course;
