import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import { useSetting } from '@/stores';
import { LoginPage, PullRequestListPage, SelectRepositoryPage } from '@/pages';
import { SettingsPage } from '@/pages/SettingsPage';
import { PrivateRoute } from '../PrivateRoute';

export const AppRoute = () => {
  const { setting } = useSetting();

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
            <PrivateRoute>
              {setting.subscribedRepositories.length === 0 ? (
                <Navigate to="/select-repository" replace />
              ) : (
                <PullRequestListPage />
              )}
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
