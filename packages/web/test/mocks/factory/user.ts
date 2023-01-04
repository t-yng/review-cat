import { User } from '../../../renderer/src/models';

export const createUser = (user?: Partial<User>) => {
  const defaultValue: User = {
    name: 'test',
    avatarUrl: 'https://example.com/images/avatar.jpg',
  };

  return {
    ...defaultValue,
    ...user,
  };
};
