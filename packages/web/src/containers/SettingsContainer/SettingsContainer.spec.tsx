import { screen } from '@testing-library/react';
import { customRender } from '@test/helpers/render';
import userEvent from '@testing-library/user-event';
import { SettingsContainer } from './SettingContainer';
import { Settings } from '../../models';

const defaultSettings: Settings = {
  notifyReviewRequested: false,
  showsRequestedReviewPR: true,
  showsInReviewPR: true,
  showsApprovedPR: true,
  showsMyPR: true,
  autoLaunched: false,
  subscribedRepositories: ['test/testA', 'test/testB'],
};

const updateNotifyReviewRequestedMock: jest.Mock = jest.fn();
const updateShowsPRMock: jest.Mock = jest.fn();
const updateAutoLaunchMock = jest.fn();
const removeSubscribedRepositoryMock: jest.Mock = jest.fn();

jest.mock('@/stores', () => ({
  useSetting() {
    return {
      setting: defaultSettings,
      updateNotifyReviewRequested: updateNotifyReviewRequestedMock,
      updateShowsPR: updateShowsPRMock,
      updateAutoLaunch: updateAutoLaunchMock,
      removeSubscribedRepository: removeSubscribedRepositoryMock,
    };
  },
}));

describe('SettingsContainer', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    updateNotifyReviewRequestedMock.mockReset();
    updateShowsPRMock.mockReset();
    updateAutoLaunchMock.mockReset();
    removeSubscribedRepositoryMock.mockReset();
  });

  const renderSettingContainer = () => {
    return customRender(<SettingsContainer />);
  };

  describe('Notification settings', () => {
    it('Callback function is called when checkbox is clicked', async () => {
      renderSettingContainer();

      const checkbox = screen.getByLabelText(
        'Receive notifications for review requests'
      );
      await user.click(checkbox);

      expect(updateNotifyReviewRequestedMock).toBeCalledWith(
        !defaultSettings.notifyReviewRequested
      );
    });
  });

  describe('PR display settings', () => {
    it.each([
      {
        label: 'Show waiting for review PRs',
        expected: {
          requestedReview: !defaultSettings.showsRequestedReviewPR,
        },
      },
      {
        label: 'Show in-review PRs',
        expected: {
          inReview: !defaultSettings.showsInReviewPR,
        },
      },
      {
        label: 'Show approved PRs',
        expected: {
          approved: !defaultSettings.showsApprovedPR,
        },
      },
    ])(
      'Callback function is called when $label checkbox is clicked',
      async ({ label, expected }) => {
        renderSettingContainer();

        const checkbox = screen.getByLabelText(label);
        await user.click(checkbox);

        expect(updateShowsPRMock).toBeCalledWith(expected);
      }
    );
  });

  describe('Launch settings', () => {
    it('Callback function is called when "Launch automatically at login" checkbox is clicked', async () => {
      renderSettingContainer();

      const checkbox = screen.getByLabelText('Launch automatically at login');
      await user.click(checkbox);

      expect(updateAutoLaunchMock).toBeCalledWith(
        !defaultSettings.autoLaunched
      );
    });
  });

  describe('Repository list', () => {
    it('Displays the list of monitored repositories', async () => {
      renderSettingContainer();

      const repositories = defaultSettings.subscribedRepositories.map(
        (repository) => {
          return screen.queryByText(repository);
        }
      );

      for (const repository of repositories) {
        expect(repository).toBeInTheDocument();
      }
    });

    it('Callback function is called when delete icon is clicked', async () => {
      renderSettingContainer();

      const deleteIcon = screen.getAllByRole('button', {
        name: 'Delete repository',
      })[0];
      await user.click(deleteIcon);

      expect(removeSubscribedRepositoryMock).toBeCalledWith('test/testA');
    });
  });
});
