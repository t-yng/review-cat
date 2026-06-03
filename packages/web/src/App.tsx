import { RecoilRoot } from 'recoil';
import { ApolloProvider } from '@apollo/client';
import { AppRoute } from './components/routes';
import { client } from './lib/apollo';
import { AppProvider } from './components/AppProvider';
import { ErrorBoundary } from './components/ErrorBoundary';

const App = () => {
  return (
    <ApolloProvider client={client}>
      <RecoilRoot>
        <ErrorBoundary>
          <AppProvider>
            <AppRoute />
          </AppProvider>
        </ErrorBoundary>
      </RecoilRoot>
    </ApolloProvider>
  );
};

export default App;
