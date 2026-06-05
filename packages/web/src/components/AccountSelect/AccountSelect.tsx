import { FC, memo, useState, useEffect } from 'react';
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
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/react';
import { themeFocusVisibleOutline } from '../../theme.css';

export type AccountSelectProps = {
  accounts: string[];
  onSelect: (account: string) => void;
};

export const AccountSelect: FC<AccountSelectProps> = memo(
  ({ accounts, onSelect }) => {
    const [selectedAccount, setSelectedAccount] = useState(accounts[0]);

    // NOTE: The initial value of useState is only applied on the first render
    //       The initial value is not applied when props are updated
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
          <ListboxButton
            className={classNames(selectButtonStyle, themeFocusVisibleOutline)}
          >
            <span>{selectedAccount}</span>
            <ChevronDownIcon className={chevronDownIconStyle} />
          </ListboxButton>
          <ListboxOptions className={listBoxStyle}>
            {accounts.map((account) => (
              <ListboxOption
                key={account}
                value={account}
                className={({ focus }) =>
                  classNames(listBoxItemStyle, {
                    [activeListBoxItemStyle]: focus,
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
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Listbox>
      </div>
    );
  }
);
