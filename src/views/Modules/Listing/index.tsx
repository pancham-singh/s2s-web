import * as React from 'react';
import { Component } from 'react';
import { Link } from 'react-router-dom';
import { Query } from 'react-apollo';

import Modal from '@src/components/Modal';
import AddNewItemTile from '@src/components/AddNewItemTile';
import ModuleTile from '@src/components/CourseTile';
import Loader from '@src/components/Loader';
import ApolloError from '@src/components/ApolloError';
import AddModuleForm from '@src/views/Modules/CreateNew';

import { IModule } from '@src/model-types';
import MODULE_LISTING from '@src/queries/module-listing.graphql';

import './style.scss';
import { ICourse } from '@src/model-types';
import { RouteComponentProps } from 'react-router';

interface ModuleListingProps {
  courseId: number | string;
  modules: IModule[];
  match: any;
}

interface RouteParams {
  courseId: number;
}

const routePrefix = (courseId) => `/courses/${courseId}`;

class ModuleListing_ extends Component<ModuleListingProps> {
  state = { isAddingNewModule: false };

  startAddingModule = () => this.setState({ isAddingNewModule: true });
  stopAddingModule = () => this.setState({ isAddingNewModule: false });

  render() {
    return (
      <div styleName="container">
        <h1>Modules</h1>

        <Modal isVisible={this.state.isAddingNewModule} onClose={this.stopAddingModule}>
          <AddModuleForm match={this.props.match} />
        </Modal>

        <div styleName="tiles">
          <AddNewItemTile title="Add New Module" onClick={this.startAddingModule} />

          {this.props.modules.map((m) => (
            <Link
              styleName="tile"
              key={m.id}
              to={`${routePrefix(this.props.courseId)}/modules/${m.id}`}
            >
              <ModuleTile course={m} />
            </Link>
          ))}
        </div>
      </div>
    );
  }
}

const ModuleListing = (props: RouteComponentProps<RouteParams>) => (
  <Query query={MODULE_LISTING} variables={{ courseId: props.match.params.courseId }}>
    {({ data, error, loading }) => {
      if (loading) {
        return <Loader isVisible={loading} />;
      }

      if (error) {
        return <ApolloError error={error} />;
      }

      return (
        <ModuleListing_
          courseId={props.match.params.courseId}
          match={props.match}
          modules={data.modules}
        />
      );
    }}
  </Query>
);

export default ModuleListing;
