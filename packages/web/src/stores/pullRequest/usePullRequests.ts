import { useRecoilValue } from 'recoil';
import { firstLoadingState, pullRequestsState } from './pullRequest';

export const usePullRequests = () => {
  const pullRequests = useRecoilValue(pullRequestsState);
  const firstLoading = useRecoilValue(firstLoadingState);

  return {
    pullRequests,
    firstLoading,
  };
};
