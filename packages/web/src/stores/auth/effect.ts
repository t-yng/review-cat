import { client } from '@/lib/apollo';
import { User } from '@/models';
import { gql } from '@apollo/client';
import { AtomEffect } from 'recoil';

export const autoSignInEffect: AtomEffect<User | null> = ({ setSelf }) => {
  fetchUser()
    .then((user) => {
      setSelf(user);
    })
    .catch((error) => {
      console.error(error);
      setSelf(null);
    });
};

const LoginUserQuery = gql`
  query LoginUserQuery {
    viewer {
      login
      avatarUrl
    }
  }
`;

const fetchUser = async (): Promise<User | null> => {
  const response = await new Promise<User>((resolve, reject) => {
    client
      .query<{
        viewer: { login: string; avatarUrl: string };
      }>({ query: LoginUserQuery, fetchPolicy: 'cache-first' })
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
