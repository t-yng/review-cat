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
  SelectRepositoryPage,
} from '../../../pages';
import { SettingsPage } from '../../../pages/SettingsPage';
import { PrivateRoute } from '../PrivateRoute';

export const AppRoute = () => {
  const { settings } = useSettings();

  return (
    <Router>
      <Switch>
        <Route path="/login">
          <LoginPage />
        </Route>
        <PrivateRoute path="/select-repository">
          <SelectRepositoryPage />
        </PrivateRoute>
        <PrivateRoute path="/settings">
          <SettingsPage />
        </PrivateRoute>
        <PrivateRoute path="/">
          {settings.subscribedRepositories.length === 0 ? (
            <Redirect to="/select-repository" />
          ) : (
            <PullRequestListPage />
          )}
        </PrivateRoute>
      </Switch>
    </Router>
  );
};
