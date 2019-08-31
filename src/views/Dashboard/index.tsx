import * as React from 'react';
import { Redirect } from 'react-router-dom';
import './style.scss';

interface DashboardProps {}
interface DashboardCallbacks {}

const Dashboard = (props: DashboardProps & DashboardCallbacks) => (
  <div styleName="container">
    <Redirect to="/courses" />
  </div>
);

export default Dashboard;
