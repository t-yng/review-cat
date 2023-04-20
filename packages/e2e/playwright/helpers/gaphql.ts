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
export const hasOperationName = (query: string, operationName: string) =>
  getQueryOperationName(query) === operationName ||
  getMutationOperationName(query) === operationName;
