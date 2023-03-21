import React from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
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
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/select-repository"
          element={
            <PrivateRoute>
              <SelectRepositoryPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <SettingsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/"
          element={
            settings.subscribedRepositories.length === 0 ? (
              <Navigate to="/select-repository" replace />
            ) : (
              <PrivateRoute>
                <PullRequestListPage />
              </PrivateRoute>
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
