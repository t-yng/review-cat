import React from 'react';
import { Provider } from 'jotai';
import { RelayEnvironmentProvider } from 'react-relay/hooks';
import RelayEnvironment from './graphql/relay/RelayEnvironment';
import { AppRoute } from './components/routes';

const App = () => {
  return (
    <RelayEnvironmentProvider environment={RelayEnvironment}>
      <Provider>
        <AppRoute />
      </Provider>
    </RelayEnvironmentProvider>
  );
};

export default App;
