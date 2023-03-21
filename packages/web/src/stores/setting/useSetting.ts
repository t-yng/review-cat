import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { settingState } from './setting';

type PullRequestVisibleOptions = {
  requestedReview?: boolean;
  inReview?: boolean;
  approved?: boolean;
  mine?: boolean;
};

export const useSetting = () => {
  const [setting, setSetting] = useRecoilState(settingState);

  const updateNotifyReviewRequested = useCallback(
    (notifyReviewRequested: boolean) => {
      setSetting((setting) => ({
        ...setting,
        notifyReviewRequested,
      }));
    },
    [setSetting]
  );

  const updateShowsPR = useCallback(
    ({
      requestedReview = setting.showsRequestedReviewPR,
      inReview = setting.showsInReviewPR,
      approved = setting.showsApprovedPR,
      mine = setting.showsMyPR,
    }: PullRequestVisibleOptions) => {
      setSetting((setting) => ({
        ...setting,
        showsRequestedReviewPR: requestedReview,
        showsInReviewPR: inReview,
        showsApprovedPR: approved,
        showsMyPR: mine,
      }));
    },
    [
      setSetting,
      setting.showsApprovedPR,
      setting.showsInReviewPR,
      setting.showsMyPR,
      setting.showsRequestedReviewPR,
    ]
  );

  const updateAutoLaunch = useCallback(
    (autoLaunched: boolean) => {
      window.ipc.updateAutoLaunch(autoLaunched);
      setSetting((setting) => ({
        ...setting,
        autoLaunched,
      }));
    },
    [setSetting]
  );

  const addSubscribedRepository = useCallback(
    (repository: string) => {
      setSetting((setting) => ({
        ...setting,
        subscribedRepositories: [...setting.subscribedRepositories, repository],
      }));
    },
    [setSetting]
  );

  const removeSubscribedRepository = useCallback(
    (repository: string) => {
      setSetting((setting) => {
        const repositories = setting.subscribedRepositories.filter(
          (r) => r !== repository
        );

        return {
          ...setting,
          subscribedRepositories: repositories,
        };
      });
    },
    [setSetting]
  );

  return {
    setting,
    updateNotifyReviewRequested,
    updateShowsPR,
    updateAutoLaunch,
    addSubscribedRepository,
    removeSubscribedRepository,
  };
};
