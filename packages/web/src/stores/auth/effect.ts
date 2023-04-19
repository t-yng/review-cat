import { LoginUserDocument } from '@/gql/generated';
import { storage } from '@/lib';
import { client } from '@/lib/apollo';
import { User } from '@/models';
import { AtomEffect } from 'recoil';

export const autoSignInEffect: AtomEffect<User | null> = ({ setSelf }) => {
  if (storage.getGithubAccessToken() == null) return;

  fetchUser()
    .then((user) => {
      setSelf(user);
    })
    .catch((error) => {
      console.error(error);
      setSelf(null);
    });
};

export const fetchUser = async (): Promise<User | null> => {
  const response = await new Promise<User>((resolve, reject) => {
    client
      .query<{
        viewer: { login: string; avatarUrl: string };
      }>({ query: LoginUserDocument, fetchPolicy: 'cache-first' })
      .then((response) => {
        resolve({
          name: response.data.viewer.login,
          avatarUrl: response.data.viewer.avatarUrl as string,
        });
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });

  if (response == null) {
    return null;
  }

  return response;
};
