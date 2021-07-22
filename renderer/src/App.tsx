import React, { Suspense } from 'react';
import { Provider, useAtom } from 'jotai';
import { LoginPage } from './pages/LoginPage';
import { tokenAtomWithPersistence } from './jotai/auth';
import { PullRequestListPage } from './pages/PullRequestList';
import { RelayEnvironmentProvider, loadQuery } from 'react-relay/hooks';
import RelayEnvironment from './graphql/relay/RelayEnvironment';
import { SearchPullRequestsQuery } from './graphql/queries/SearchPullRequest';

// TODO: 別コンポーネントファイルに分割する
//       リファクタ
// TODO: react-router でルーティングする
const Layout = () => {
  const [token] = useAtom(tokenAtomWithPersistence);
  console.log(token);

  return token != null ? (
    <Suspense fallback="Loading PullRequests...">
      <PullRequestListPage
        preloadedQuery={loadQuery(
          RelayEnvironment,
          SearchPullRequestsQuery,
          {}
        )}
      />
    </Suspense>
  ) : (
    <Suspense fallback="Loading...">
      <LoginPage />
    </Suspense>
  );
};

const App = () => {
  const [token] = useAtom(tokenAtomWithPersistence);
  console.log(token);

  return (
    <RelayEnvironmentProvider environment={RelayEnvironment}>
      <Provider>
        <div className="App">
          <Layout />
        </div>
      </Provider>
    </RelayEnvironmentProvider>
  );
};

export default App;
