import { BaseLayout } from '../../layouts/BaseLayout';
import {
  titleWrapperStyle,
  titleStyle,
  rootStyle,
  contentStyle,
} from './style.css';
import { SettingsContainer } from '../../containers/SettingsContainer';

export const SettingsPage = () => {
  return (
    <BaseLayout>
      <div className={rootStyle}>
        <div className={titleWrapperStyle}>
          <h1 className={titleStyle}>Settings</h1>
        </div>
        <div className={contentStyle}>
          <SettingsContainer />
        </div>
      </div>
    </BaseLayout>
  );
};
