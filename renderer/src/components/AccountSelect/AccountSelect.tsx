/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { FC, memo, useState, useCallback, useEffect } from 'react';
import { ChevronDownIcon } from '@primer/octicons-react';
import {
  chevronDownIconStyle,
  rootStyle,
  selectMenuItemStyle,
  selectMenuStyle,
  selectStyle,
} from './AccountSelect.css';

export type AccountSelectProps = {
  onSelect: (account: string) => void;
};

export const AccountSelect: FC<AccountSelectProps> = memo(({ onSelect }) => {
  const [openedSelectMenu, setOpenedSelectMenu] = useState(false);

  const bodyClickEventListener = useCallback(() => {
    setOpenedSelectMenu(false);
  }, []);

  useEffect(() => {
    document.body.addEventListener('click', bodyClickEventListener);

    return () => {
      document.body.addEventListener('click', bodyClickEventListener);
    };
  }, [bodyClickEventListener]);

  return (
    <div className={rootStyle}>
      <div
        className={selectStyle}
        onClick={(e) => {
          e.stopPropagation();
          setOpenedSelectMenu((opened) => !opened);
        }}
        data-testid="account-select-box"
      >
        <span>higeOhige</span>
        <ChevronDownIcon className={chevronDownIconStyle} />
      </div>
      {openedSelectMenu && (
        <ul className={selectMenuStyle} role="listbox">
          <li
            onClick={(e) => {
              e.stopPropagation();
              onSelect('higeOhige');
            }}
            className={selectMenuItemStyle}
          >
            higeOhige
          </li>
        </ul>
      )}
    </div>
  );
});
