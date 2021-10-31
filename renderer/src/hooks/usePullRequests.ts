import { useAtomValue } from 'jotai/utils';
import { pullRequestsReducerAtom } from '../jotai/pullRequest';

export const usePullRequests = () => {
  const { pullRequests, firstLoading } = useAtomValue(pullRequestsReducerAtom);

  return {
    firstLoading,
    pullRequests,
  };
};
