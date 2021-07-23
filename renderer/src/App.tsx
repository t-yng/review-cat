import React, { Suspense } from 'react';
import { Provider, useAtom } from 'jotai';
import { RelayEnvironmentProvider } from 'react-relay/hooks';
import { LoginPage, PullRequestListPage } from './pages';
import RelayEnvironment from './graphql/relay/RelayEnvironment';
import { isLoggedInAtom } from './jotai';

// TODO: 別コンポーネントファイルに分割する
//       リファクタ
// TODO: react-router でルーティングする
const AppRoute = () => {
  const [isLoggedIn] = useAtom(isLoggedInAtom);

  return isLoggedIn != null ? (
    // TODO: Suspenseを削除するリファクタを実施
    <Suspense fallback="Loading...">
      <PullRequestListPage />
    </Suspense>
  ) : (
    <Suspense fallback="Loading...">
      <LoginPage />
    </Suspense>
  );
};

const App = () => {
  return (
    <RelayEnvironmentProvider environment={RelayEnvironment}>
      <Provider>
        <div className="App">
          <AppRoute />
        </div>
      </Provider>
    </RelayEnvironmentProvider>
  );
};

export default App;
