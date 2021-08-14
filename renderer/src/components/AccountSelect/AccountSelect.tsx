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
  accounts: string[];
  onSelect: (account: string) => void;
};

export const AccountSelect: FC<AccountSelectProps> = memo(
  ({ accounts, onSelect }) => {
    const [account, setAccount] = useState(accounts[0]);
    const [openedSelectMenu, setOpenedSelectMenu] = useState(false);

    const bodyClickEventListener = useCallback(() => {
      setOpenedSelectMenu(false);
    }, []);

    // NOTE: useStateの初期値は最初のレンダリングの時だけ反映される
    //       propsが更新されたタイミングでは初期値は反映されない
    useEffect(() => {
      setAccount(accounts[0]);
    }, [accounts]);

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
          <span>{account}</span>
          <ChevronDownIcon className={chevronDownIconStyle} />
        </div>
        {openedSelectMenu && (
          <ul className={selectMenuStyle} role="listbox">
            {accounts.map((account) => (
              <li
                key={account}
                onClick={(e) => {
                  e.stopPropagation();
                  setAccount(account);
                  onSelect(account);
                }}
                className={selectMenuItemStyle}
              >
                {account}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
);
