import React, { ChangeEvent, FC } from 'react';
import { Link } from 'react-router-dom';
import { XCircleFillIcon } from '@primer/octicons-react';
import { useSettings } from '../../hooks';
import {
  settingSectionStyle,
  settingSectionTitleStyle,
  settingItemStyle,
  settingItemLabelStyle,
  settingItemListStyle,
  deleteIconStyle,
  repositoryListItemStyle,
} from './style.css';
import { Settings as SettingsModel } from '../../models';

type SettingsProps = {
  settings: SettingsModel;
  onChangeNotifyReviewRequested: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeShowsRequestedReviewPr: (
    event: ChangeEvent<HTMLInputElement>
  ) => void;
  onChangedShowsInReviewPr: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangedShowsApprovedPr: (event: ChangeEvent<HTMLInputElement>) => void;
  onClickDeleteRepository: (repository: string) => void;
};

const Settings: FC<SettingsProps> = ({
  settings,
  onChangeNotifyReviewRequested,
  onChangeShowsRequestedReviewPr,
  onChangedShowsInReviewPr,
  onChangedShowsApprovedPr,
  onClickDeleteRepository,
}) => {
  return (
    <>
      <div className={settingSectionStyle}>
        <h2 className={settingSectionTitleStyle}>通知</h2>
        <div className={settingItemListStyle}>
          <div className={settingItemStyle}>
            <input
              type="checkbox"
              id="notify-review-requested"
              onChange={onChangeNotifyReviewRequested}
              defaultChecked={settings.notifyReviewRequested}
            />
            <label
              htmlFor="notify-review-requested"
              className={settingItemLabelStyle}
            >
              レビューリクエスト時に通知を受け取る
            </label>
          </div>
        </div>
      </div>
      <div className={settingSectionStyle}>
        <h2 className={settingSectionTitleStyle}>PRの表示</h2>
        <div className={settingItemListStyle}>
          <div className={settingItemStyle}>
            <input
              type="checkbox"
              id="shows-requested-review-pr"
              onChange={onChangeShowsRequestedReviewPr}
              defaultChecked={settings.showsRequestedReviewPR}
            />
            <label
              htmlFor="shows-requested-review-pr"
              className={settingItemLabelStyle}
            >
              レビュー待ちのPRを表示
            </label>
          </div>
          <div className={settingItemStyle}>
            <input
              type="checkbox"
              id="shows-in-review-pr"
              onChange={onChangedShowsInReviewPr}
              defaultChecked={settings.showsInReviewPR}
            />
            <label
              htmlFor="shows-in-review-pr"
              className={settingItemLabelStyle}
            >
              レビュー中のPRを表示
            </label>
          </div>
          <div className={settingItemStyle}>
            <input
              type="checkbox"
              id="shows-approved-pr"
              onChange={onChangedShowsApprovedPr}
              defaultChecked={settings.showsApprovedPR}
            />
            <label
              htmlFor="shows-approved-pr"
              className={settingItemLabelStyle}
            >
              承認済みのPRを表示
            </label>
          </div>
        </div>
      </div>
      <div className={settingSectionStyle}>
        <h2 className={settingSectionTitleStyle}>リポジトリ一覧</h2>
        {settings.subscribedRepositories.map((repository) => (
          <div className={repositoryListItemStyle} key={repository}>
            <span>{repository}</span>
            <button
              aria-label="リポジトリを削除"
              onClick={() => onClickDeleteRepository(repository)}
            >
              <XCircleFillIcon className={deleteIconStyle} size={16} />
            </button>
          </div>
        ))}
        <Link to="/select-repository">+ 追加</Link>
      </div>
    </>
  );
};

export const SettingsContainer = () => {
  const {
    settings,
    updateNotifyReviewRequested,
    updateShowsPR,
    removeSubscribedRepository,
  } = useSettings();

  const handleChangeNotifyReviewRequested = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    updateNotifyReviewRequested(event.target.checked);
  };

  const handleShowsRequestedReview = (event: ChangeEvent<HTMLInputElement>) => {
    updateShowsPR({
      requestedReview: event.target.checked,
    });
  };

  const handleShowsInReview = (event: ChangeEvent<HTMLInputElement>) => {
    updateShowsPR({
      inReview: event.target.checked,
    });
  };

  const handleShowsApproved = (event: ChangeEvent<HTMLInputElement>) => {
    updateShowsPR({
      approved: event.target.checked,
    });
  };

  return (
    <Settings
      settings={settings}
      onChangeNotifyReviewRequested={handleChangeNotifyReviewRequested}
      onChangeShowsRequestedReviewPr={handleShowsRequestedReview}
      onChangedShowsInReviewPr={handleShowsInReview}
      onChangedShowsApprovedPr={handleShowsApproved}
      onClickDeleteRepository={removeSubscribedRepository}
    />
  );
};
