import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components';
import { useSetting } from '@/stores';
import { BaseLayout } from '../../layouts/BaseLayout';
import { completeButtonStyle, containerStyle, titleStyle } from './styles.css';
import { SelectRepositoryContainer } from '../../containers/SelectRepositoryContainer/SelectRepositoryContainer';

export const SelectRepositoryPage = () => {
  const navigate = useNavigate();
  const { setting } = useSetting();

  const handleClick = useCallback(() => {
    if (setting.subscribedRepositories.length === 0) {
      alert('Please select at least one repository to review.');
    } else {
      navigate('/', { replace: true });
    }
  }, [setting, navigate]);

  return (
    <BaseLayout>
      <div className={containerStyle}>
        <h1 className={titleStyle}>Select Repository</h1>
        <SelectRepositoryContainer />
        <Button className={completeButtonStyle} onClick={handleClick}>
          Done
        </Button>
      </div>
    </BaseLayout>
  );
};
