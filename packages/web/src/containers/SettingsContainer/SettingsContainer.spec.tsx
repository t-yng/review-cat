import React from 'react';
import { render, screen } from '@testing-library/react';
import { SettingsContainer } from './SettingContainer';
import userEvent from '@testing-library/user-event';
import { Settings } from '../../models';
import { MemoryRouter } from 'react-router-dom';

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

jest.mock('../../hooks/useSettings', () => ({
  useSettings() {
    return {
      settings: defaultSettings,
      updateNotifyReviewRequested: updateNotifyReviewRequestedMock,
      updateShowsPR: updateShowsPRMock,
      updateAutoLaunch: updateAutoLaunchMock,
      removeSubscribedRepository: removeSubscribedRepositoryMock,
    };
  },
}));

describe('SettingsContainer', () => {
  beforeEach(() => {
    updateNotifyReviewRequestedMock.mockReset();
    updateShowsPRMock.mockReset();
    updateAutoLaunchMock.mockReset();
    removeSubscribedRepositoryMock.mockReset();
  });

  const renderSettingContainer = () => {
    return render(
      <MemoryRouter>
        <SettingsContainer />
      </MemoryRouter>
    );
  };

  describe('通知設定', () => {
    it('チェックボックスがクリックされた時にコールバック関数が呼ばれる', () => {
      renderSettingContainer();

      const checkbox =
        screen.getByLabelText('レビューリクエスト時に通知を受け取る');
      userEvent.click(checkbox);

      expect(updateNotifyReviewRequestedMock).toBeCalledWith(
        !defaultSettings.notifyReviewRequested
      );
    });
  });

  describe('PR表示の設定', () => {
    it.each([
      {
        label: 'レビュー待ちのPRを表示',
        expected: {
          requestedReview: !defaultSettings.showsRequestedReviewPR,
        },
      },
      {
        label: 'レビュー中のPRを表示',
        expected: {
          inReview: !defaultSettings.showsInReviewPR,
        },
      },
      {
        label: '承認済みのPRを表示',
        expected: {
          approved: !defaultSettings.showsApprovedPR,
        },
      },
    ])(
      '$label のチェックボックスがクリックされた時にコールバック関数が呼ばれる',
      ({ label, expected }) => {
        renderSettingContainer();

        const checkbox = screen.getByLabelText(label);
        userEvent.click(checkbox);

        expect(updateShowsPRMock).toBeCalledWith(expected);
      }
    );
  });

  describe('起動設定', () => {
    it('「ログイン時に自動で起動する」のチェックボックスをクリックされた時にコールバック関数が呼ばれる', () => {
      renderSettingContainer();

      const checkbox = screen.getByLabelText('ログイン時に自動で起動する');
      userEvent.click(checkbox);

      expect(updateAutoLaunchMock).toBeCalledWith(
        !defaultSettings.autoLaunched
      );
    });
  });

  describe('リポジトリ一覧', () => {
    it('監視しているリポジトリの一覧を表示する', () => {
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

    it('削除アイコンをクリックした時にコールバック関数が呼ばれる', () => {
      renderSettingContainer();

      const deleteIcon = screen.getAllByRole('button', {
        name: 'リポジトリを削除',
      })[0];
      userEvent.click(deleteIcon);

      expect(removeSubscribedRepositoryMock).toBeCalledWith('test/testA');
    });
  });
});
