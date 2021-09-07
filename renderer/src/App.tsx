import React from 'react';
import { Provider } from 'jotai';
import { ApolloProvider } from '@apollo/client';
import { AppRoute } from './components/routes';
import { client } from './lib/apollo';

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Provider>
        <AppRoute />
      </Provider>
    </ApolloProvider>
  );
};

export default App;
