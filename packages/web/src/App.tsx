import React, { Suspense } from 'react';
import { Provider } from 'jotai';
import { RecoilRoot } from 'recoil';
import { ApolloProvider } from '@apollo/client';
import { AppRoute } from './components/routes';
import { client } from './lib/apollo';
import { AppProvider } from './components/AppProvider';

const App = () => {
  return (
    <ApolloProvider client={client}>
      <RecoilRoot>
        <Provider>
          <Suspense fallback="Loading...">
            <AppProvider>
              <AppRoute />
            </AppProvider>
          </Suspense>
        </Provider>
      </RecoilRoot>
    </ApolloProvider>
  );
};

export default App;
