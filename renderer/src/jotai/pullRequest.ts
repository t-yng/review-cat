import { atomWithReducer } from 'jotai/utils';
import { notifyPullRequests } from '../lib/notification';
import { PullRequest } from '../models';

export const START_FETCH_ACTION = 'startFetchPullRequests' as const;
export const UPDATE_ACTION = 'updatePullRequests' as const;

type StartFetchAction = {
  type: typeof START_FETCH_ACTION;
};

type UpdateAction = {
  type: typeof UPDATE_ACTION;
  payload: {
    pullRequests: PullRequest[];
  };
};

type Action = StartFetchAction | UpdateAction;

type State = {
  pullRequests: PullRequest[];
  firstLoading: boolean;
};

const initialState: State = {
  pullRequests: [],
  firstLoading: false,
};

const pullRequestReducer = (prev: State, action: Action): State => {
  switch (action.type) {
    case START_FETCH_ACTION: {
      return {
        ...prev,
        firstLoading: true,
      };
    }
    case UPDATE_ACTION: {
      const newPullRequests = action.payload.pullRequests;
      if (!prev.firstLoading) {
        notifyPullRequests(newPullRequests, prev.pullRequests);
      }

      return {
        pullRequests: newPullRequests,
        firstLoading: false,
      };
    }
    default: {
      return prev;
    }
  }
};

export const pullRequestsReducerAtom = atomWithReducer(
  initialState,
  pullRequestReducer
);
