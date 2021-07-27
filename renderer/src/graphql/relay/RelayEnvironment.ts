import {
  Environment,
  Network,
  RecordSource,
  RequestParameters,
  Variables,
  Store,
} from 'relay-runtime';
import { fetchGraphQL } from '../fetchGraphQL';

const fetchRelay = async (params: RequestParameters, variables: Variables) => {
  return fetchGraphQL(params.text, variables);
};

export default new Environment({
  network: Network.create(fetchRelay),
  store: new Store(new RecordSource()),
});
