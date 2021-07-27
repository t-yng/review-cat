import { atom } from 'jotai';
import { fetchQuery } from 'relay-runtime';
import { LoginUserQuery } from '../graphql/queries/LoginUserQuery';
import { LoginUserQuery as LoginUserQueryType } from '../graphql/queries/__generated__/LoginUserQuery.graphql';
import RelayEnvironment from '../graphql/relay/RelayEnvironment';
import { User } from '../models';

export const userAtom = atom<User | null>(null);

export const loginUserAtom = atom(
  (get) => get(userAtom),
  async (get, set) => {
    try {
      const user = await fetchUser();
      set(userAtom, user);
    } catch (error) {
      console.error(error);
      set(userAtom, null);
    }
  }
);

const fetchUser = async (): Promise<User | null> => {
  const response = await fetchQuery<LoginUserQueryType>(
    RelayEnvironment,
    LoginUserQuery,
    {}
  ).toPromise();

  if (response == null) {
    return null;
  }

  return {
    name: response.viewer.login,
    avatarUrl: response.viewer.avatarUrl as string,
  };
};
