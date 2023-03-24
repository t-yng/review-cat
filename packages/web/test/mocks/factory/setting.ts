import { Settings } from '@/models';

export const createSetting = (setting?: Partial<Settings>) => {
  const defaultValue: Settings = {
    notifyReviewRequested: false,
    showsRequestedReviewPR: true,
    showsInReviewPR: true,
    showsApprovedPR: true,
    showsMyPR: true,
    autoLaunched: false,
    subscribedRepositories: [],
  };

  return {
    ...defaultValue,
    ...setting,
  };
};
