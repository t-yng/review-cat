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
      requestedReview,
      inReview,
      approved,
    }: {
      requestedReview: boolean;
      inReview: boolean;
      approved: boolean;
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
    [dispatch]
  );

  const updateSubscribedPRList = useCallback(
    (prList: string[]) => {
      dispatch({
        type: UPDATE_ACTION,
        payload: {
          subscribedPRList: prList,
        },
      });
    },
    [dispatch]
  );

  return {
    settings,
    updateNotifyReviewRequested,
    updateShowsPR,
    updateSubscribedPRList,
  };
};
