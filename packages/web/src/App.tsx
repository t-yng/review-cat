import { Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { ApolloProvider } from '@apollo/client';
import { AppRoute } from './components/routes';
import { client } from './lib/apollo';
import { AppProvider } from './components/AppProvider';

const App = () => {
  return (
    <ApolloProvider client={client}>
      <RecoilRoot>
        <Suspense fallback="Loading...">
          <AppProvider>
            <AppRoute />
          </AppProvider>
        </Suspense>
      </RecoilRoot>
    </ApolloProvider>
  );
};

export default App;
