import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/stores';
import { Button } from '../Button';
import { AppIcon } from '../AppIcon';
import { rootStyle, buttonContainerStyle } from './styles.css';

export const LoginContent: FC = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleClick = () => {
    signIn(() => {
      navigate('/', { replace: true });
    });
  };

  return (
    <div className={rootStyle}>
      <AppIcon />
      <div className={buttonContainerStyle}>
        <Button onClick={handleClick}>Login To GitHub</Button>
      </div>
    </div>
  );
};
