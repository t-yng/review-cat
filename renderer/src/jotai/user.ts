import { atom } from 'jotai';
import { gql } from '@apollo/client';
import { client } from '../lib/apollo';
import { User } from '../models';

export const LoginUserQuery = gql`
  query LoginUserQuery {
    viewer {
      login
      avatarUrl
    }
  }
`;

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
  const response = await new Promise<User>((resolve, reject) => {
    client
      .query<{
        viewer: { login: string; avatarUrl: string };
      }>({ query: LoginUserQuery })
      .then((response) => {
        resolve({
          name: response.data.viewer.login,
          avatarUrl: response.data.viewer.avatarUrl as string,
        });
      })
      .catch((error) => {
        reject(error);
      });
  });

  if (response == null) {
    return null;
  }

  return response;
};
