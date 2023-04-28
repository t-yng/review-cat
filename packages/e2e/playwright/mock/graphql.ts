import { type Page } from 'playwright';

type MockGraphQLResponse = {
  status?: number;
  body: { [key: string]: any };
};

type MockGraphQL = {
  page: Page;
  operation: string;
  res: MockGraphQLResponse;
};

export const mockGitHubGraphQL = ({ page, operation, res }: MockGraphQL) => {
  page.route('https://api.github.com/graphql', (route) => {
    const reqBody = route.request().postDataJSON();
    if (hasOperationName(reqBody.query, operation)) {
      return route.fulfill({
        status: res.status || 200,
        headers: {
          contentType: 'application/json',
        },
        body: JSON.stringify({
          data: res.body,
        }),
      });
    }
  });
};

const getQueryOperationName = (query: string): string => {
  const operationNameRegex = /(?<=query\s).*(?=\s{)/;
  const operationNameList: string[] | null = query.match(operationNameRegex);
  return operationNameList ? operationNameList[0] : '';
};

const getMutationOperationName = (query: string): string => {
  const operationNameRegex = /(?<=mutation\s).*(?=\s\()/;
  const operationNameList: string[] | null = query.match(operationNameRegex);
  return operationNameList ? operationNameList[0] : '';
};

/**
 * クエリに指定したoperationNameが含まれるか判定する
 * @param query GraphQLクエリ
 * @param operationName 判定対象のoperationName
 * @returns
 */
const hasOperationName = (query: string, operationName: string) =>
  getQueryOperationName(query) === operationName ||
  getMutationOperationName(query) === operationName;
