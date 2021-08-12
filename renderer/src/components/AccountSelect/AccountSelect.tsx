/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { FC, memo, useState } from 'react';
import { ChevronDownIcon } from '@primer/octicons-react';
import {
  chevronDownIconStyle,
  rootStyle,
  selectMenuStyle,
  selectStyle,
} from './AccountSelect.css';

export type AccountSelectProps = {
  onSelect: (account: string) => void;
};

export const AccountSelect: FC<AccountSelectProps> = memo(({ onSelect }) => {
  const [openedSelectMenu, setOpenedSelectMenu] = useState(false);

  return (
    <div className={rootStyle}>
      <div
        className={selectStyle}
        onClick={() => {
          setOpenedSelectMenu((opened) => !opened);
        }}
        data-testid="account-select-box"
      >
        <span>higeOhige</span>
        <ChevronDownIcon className={chevronDownIconStyle} />
      </div>
      {openedSelectMenu && (
        <ul className={selectMenuStyle} role="listbox">
          <li onClick={() => onSelect('higeOhige')}>higeOhige</li>
        </ul>
      )}
    </div>
  );
});
