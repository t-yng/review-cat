import React from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { LoginPage, PullRequestListPage } from '../../../pages';
import { PrivateRoute } from '../PrivateRoute';

export const AppRoute = () => {
  return (
    <Router>
      <Switch>
        <Route path="/login">
          <LoginPage />
        </Route>
        <PrivateRoute path="/">
          <PullRequestListPage />
        </PrivateRoute>
      </Switch>
    </Router>
  );
};
