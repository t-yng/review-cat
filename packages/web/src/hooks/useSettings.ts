import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { settingsReducerAtom, UPDATE_ACTION } from '../jotai/settings';

export const useSettings = () => {
  const [settings, dispatch] = useAtom(settingsReducerAtom);

  const updateNotifyReviewRequested = useCallback(
    (notifyReviewRequested: boolean) => {
      dispatch({
        type: UPDATE_ACTION,
        payload: {
          notifyReviewRequested,
        },
      });
    },
    [dispatch]
  );

  const updateShowsPR = useCallback(
    ({
      requestedReview = settings.showsRequestedReviewPR,
      inReview = settings.showsInReviewPR,
      approved = settings.showsApprovedPR,
    }: {
      requestedReview?: boolean;
      inReview?: boolean;
      approved?: boolean;
    }) => {
      dispatch({
        type: UPDATE_ACTION,
        payload: {
          showsRequestedReviewPR: requestedReview,
          showsInReviewPR: inReview,
          showsApprovedPR: approved,
        },
      });
    },
    [dispatch, settings]
  );

  const updateAutoLaunch = useCallback(
    (autoLaunched: boolean) => {
      window.ipc.updateAutoLaunch(autoLaunched);
      dispatch({
        type: UPDATE_ACTION,
        payload: {
          autoLaunched: autoLaunched,
        },
      });
    },
    [dispatch]
  );

  const addSubscribedRepository = useCallback(
    (repository: string) => {
      const repositories = [...settings.subscribedRepositories, repository];
      dispatch({
        type: UPDATE_ACTION,
        payload: {
          subscribedRepositories: repositories,
        },
      });
    },
    [dispatch, settings]
  );

  const removeSubscribedRepository = useCallback(
    (repository: string) => {
      const repositories = settings.subscribedRepositories.filter(
        (r) => r !== repository
      );
      dispatch({
        type: UPDATE_ACTION,
        payload: {
          subscribedRepositories: repositories,
        },
      });
    },
    [dispatch, settings]
  );

  return {
    settings,
    updateNotifyReviewRequested,
    updateShowsPR,
    updateAutoLaunch,
    addSubscribedRepository,
    removeSubscribedRepository,
  };
};
