/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { useState } from 'react';
import { ChevronDownIcon } from '@primer/octicons-react';
import {
  chevronDownIconStyle,
  rootStyle,
  selectMenuStyle,
  selectStyle,
} from './AccountSelect.css';

export const AccountSelect = () => {
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
          <li>higeOhige</li>
        </ul>
      )}
    </div>
  );
};
