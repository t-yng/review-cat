import { type Page } from 'playwright';

type MockGraphQLResponse = {
  status?: number;
  body: { [key: string]: any };
};

type MockGraphQL = {
  page: Page;
  operation: string;
  response: MockGraphQLResponse;
};

export const mockGitHubGraphQL = ({
  page,
  operation,
  response,
}: MockGraphQL) => {
  page.route('https://api.github.com/graphql', (route) => {
    const reqBody = route.request().postDataJSON();

    if (hasOperationName(reqBody.query, operation)) {
      return route.fulfill({
        status: response.status || 200,
        headers: {
          contentType: 'application/json; charset=utf-8',
        },
        body:
          typeof response.body === 'string'
            ? response.body
            : JSON.stringify({
                data: response.body,
              }),
      });
    } else {
      // Pass the request through if the specified operation is not included
      route.fallback();
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
 * Determine if the specified operationName is included in the query
 * @param query GraphQL query
 * @param operationName The operationName to check
 * @returns
 */
const hasOperationName = (query: string, operationName: string) => {
  return (
    getQueryOperationName(query).includes(operationName) ||
    getMutationOperationName(query).includes(operationName)
  );
};
