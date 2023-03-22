import { graphql } from 'msw';

export const handlers = [
  graphql.query('LoginUserQuery', (req, res, ctx) => {
    return res(
      ctx.data({
        viewer: {
          login: 't-yng',
          avatarUrl: 'https://avatars.githubusercontent.com/u/11068883?v=4',
        },
      })
    );
  }),
];
