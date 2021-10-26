import React, { Suspense } from 'react';
import { Provider } from 'jotai';
import { ApolloProvider } from '@apollo/client';
import { AppRoute } from './components/routes';
import { client } from './lib/apollo';
import { AppProvider } from './components/AppProvider/AppProvider';

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Provider>
        <Suspense fallback="Loading...">
          <AppProvider>
            <AppRoute />
          </AppProvider>
        </Suspense>
      </Provider>
    </ApolloProvider>
  );
};

export default App;
