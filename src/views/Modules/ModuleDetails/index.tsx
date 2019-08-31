import * as React from 'react';
import { Link } from 'react-router-dom';
import { Query } from 'react-apollo';
import MODULE_DETAILS from '@src/queries/module-details.graphql';
import MODULE_LISTING from '@src/queries/module-listing.graphql';
import UPDATE_MODULE from '@src/queries/update-module.graphql';
import DELETE_MODULE from '@src/queries/delete-module.graphql';
import DeletePrompt from '@src/components/DeletePrompt';
import Modal from '@src/components/Modal';
import EditForm from '@src/views/Modules/CreateNew';
import Loader from '@src/components/Loader';
import BreadCrumbs from '@src/components/BreadCrumbs';
import ApolloError from '@src/components/ApolloError';
import ModuleTile from '@src/components/CourseTile';
import { IModule as ModuleType } from '@src/model-types';
import './style.scss';
import { RouteComponentProps } from 'react-router';
import TopicListing from '@src/views/Topics/Listing';
import { Component } from 'react';

interface RouteParams {
  courseId: string;
  moduleId: string;
}

interface ModuleDetailsProps extends RouteComponentProps<RouteParams> {
  module: ModuleType;
}

const deleteMutation = (mutation, variables) =>
  mutation({
    variables,
    update: (cache) => {
      const { modules } = cache.readQuery({ query: MODULE_LISTING, variables });
      cache.writeQuery({
        query: MODULE_LISTING,
        variables,
        data: { modules: modules.filter((c) => String(c.id) !== String(variables.id)) }
      });
    }
  });

class ModuleDetails extends Component<ModuleDetailsProps> {
  state = { isEditing: false, isDeleting: false };

  showDeletePrompt = () => this.setState({ isDeleting: true });
  hideDeletePrompt = () => this.setState({ isDeleting: false });

  showEditForm = () => this.setState({ isEditing: true });
  hideEditForm = () => this.setState({ isEditing: false });

  render() {
    const m = this.props.module;
    const courseId = this.props.module.course.id;

    if (!this.props.module) {
      return <h1>Module Not Found</h1>;
    }

    return (
      <div styleName="content">
        <DeletePrompt
          title="Do you really want to delete this Module?"
          subtitle="This will delete the module, all its topics and everything therein."
          mutation={DELETE_MODULE}
          isVisible={this.state.isDeleting}
          variables={{ id: this.props.module.id, courseId }}
          onDelete={() => this.props.history.push(`/courses/${courseId}`)}
          onCancel={this.hideDeletePrompt}
          handleMutation={deleteMutation}
        />

        <Modal isVisible={this.state.isEditing} onClose={this.hideEditForm}>
          <EditForm {...this.props} module={this.props.module} />
        </Modal>

        <h1 styleName="header">
          {m.name}
          <div styleName="controls">
            <i styleName="edit" title="Edit" onClick={this.showEditForm} />
            <i styleName="delete" title="Delete" onClick={this.showDeletePrompt} />
          </div>
        </h1>

        <div>{m.description}</div>

        <TopicListing {...this.props} />
      </div>
    );
  }
}

interface ModuleProps extends RouteComponentProps<RouteParams> {}

const Module = (props: ModuleProps) => (
  <Query query={MODULE_DETAILS} variables={{ id: props.match.params.moduleId }}>
    {({ loading, error, data }) => {
      const courseId = props.match.params.courseId;

      const crumbs = {
        Courses: '/courses'
      };

      if (data && data.module) {
        crumbs[data.module.course.name] = `/courses/${courseId}`;
        crumbs[data.module.name] = null;
      }

      return (
        <div styleName="container">
          <BreadCrumbs crumbs={crumbs} />
          <Loader isVisible={loading} />

          {error && <ApolloError error={error} />}

          {!loading && !error && <ModuleDetails module={data.module} {...props} />}
        </div>
      );
    }}
  </Query>
);

export default Module;
