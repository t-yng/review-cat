import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '../../components';
import { useSettings } from '../../hooks';
import { BaseLayout } from '../../layouts/BaseLayout';
import { completeButtonStyle, containerStyle, titleStyle } from './styles.css';
import { SelectRepositoryContainer } from '../../containers/SelectRepositoryContainer/SelectRepositoryContainer';

export const SelectRepositoryPage = () => {
  const history = useHistory();
  const { settings } = useSettings();

  const handleClick = useCallback(() => {
    if (settings.subscribedRepositories.length === 0) {
      alert('レビュー対象のリポジトリを1つ以上選択してください。');
    } else {
      history.replace('/');
    }
  }, [settings, history]);

  return (
    <BaseLayout>
      <div className={containerStyle}>
        <h1 className={titleStyle}>リポジトリを選択</h1>
        <SelectRepositoryContainer />
        <Button className={completeButtonStyle} onClick={handleClick}>
          完了
        </Button>
      </div>
    </BaseLayout>
  );
};
