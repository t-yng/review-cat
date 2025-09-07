import { LoginUserDocument } from '@/gql/generated';
import { client } from '@/lib/apollo';
import { User } from '@/models';

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
