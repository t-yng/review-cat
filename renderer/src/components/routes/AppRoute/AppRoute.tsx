import React from 'react';
import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect,
} from 'react-router-dom';
import { useSettings } from '../../../hooks/useSettings';
import {
  LoginPage,
  PullRequestListPage,
  SelectRepositoriesPage,
} from '../../../pages';
import { PrivateRoute } from '../PrivateRoute';

export const AppRoute = () => {
  const { settings } = useSettings();
  return (
    <Router>
      <Switch>
        <Route path="/login">
          <LoginPage />
        </Route>
        <PrivateRoute path="/select-repositories">
          <SelectRepositoriesPage />
        </PrivateRoute>
        <PrivateRoute path="/">
          {settings.subscribedPRList.length === 0 ? (
            <Redirect to="/select-repositories" />
          ) : (
            <PullRequestListPage />
          )}
        </PrivateRoute>
      </Switch>
    </Router>
  );
};
