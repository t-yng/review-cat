import type { Repository } from '../../../src/models';

export const createRepository = (repository?: Partial<Repository>) => {
  const defaultValue: Repository = {
    nameWithOwner: 'test/testA',
    openGraphImageUrl: 'https://example.com/images/avatar.jpg',
  };

  return {
    ...defaultValue,
    ...repository,
  };
};
