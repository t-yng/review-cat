import React, { FC, memo, useState, useEffect } from 'react';
import classNames from 'classnames';
import { ChevronDownIcon, CheckIcon } from '@primer/octicons-react';
import {
  chevronDownIconStyle,
  rootStyle,
  listBoxStyle,
  listBoxItemStyle,
  selectButtonStyle,
  checkIconStyle,
  activeListBoxItemStyle,
} from './style.css';
import { Listbox } from '@headlessui/react';
import { themeFocusVisibleOutline } from '../../theme.css';

export type AccountSelectProps = {
  accounts: string[];
  onSelect: (account: string) => void;
};

export const AccountSelect: FC<AccountSelectProps> = memo(
  ({ accounts, onSelect }) => {
    const [selectedAccount, setSelectedAccount] = useState(accounts[0]);

    // NOTE: useStateの初期値は最初のレンダリングの時だけ反映される
    //       propsが更新されたタイミングでは初期値は反映されない
    useEffect(() => {
      setSelectedAccount(accounts[0]);
    }, [accounts]);

    const handleSelect = (account: string) => {
      setSelectedAccount(account);
      onSelect(account);
    };

    return (
      <div className={rootStyle}>
        <Listbox value={selectedAccount} onChange={handleSelect}>
          <Listbox.Button
            className={classNames(selectButtonStyle, themeFocusVisibleOutline)}
          >
            <span>{selectedAccount}</span>
            <ChevronDownIcon className={chevronDownIconStyle} />
          </Listbox.Button>
          <Listbox.Options className={listBoxStyle}>
            {accounts.map((account) => (
              <Listbox.Option
                key={account}
                value={account}
                className={({ active }) =>
                  classNames(listBoxItemStyle, {
                    [activeListBoxItemStyle]: active,
                  })
                }
              >
                {({ selected }) => (
                  <>
                    {selected && (
                      <CheckIcon size={16} className={checkIconStyle} />
                    )}
                    {account}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Listbox>
      </div>
    );
  }
);
