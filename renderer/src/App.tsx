import React, { Suspense } from 'react';
import { Provider, useAtom } from 'jotai';
import './App.css';
import { LoginPage } from './pages/Login';
import { tokenAtomWithPersistence } from './jotai/auth';
import { PullRequestListPage } from './pages/PullRequestList';

// TODO: 別コンポーネントファイルに分割する
//       リファクタ
// TODO: react-router でルーティングする
const Layout = () => {
  const [token] = useAtom(tokenAtomWithPersistence);
  console.log(token);

  return token != null ? (
    <PullRequestListPage />
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
    <Provider>
      <div className="App">
        <Layout />
      </div>
    </Provider>
  );
};

export default App;
