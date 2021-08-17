import React, { ChangeEvent, KeyboardEvent, memo, useState } from 'react';
import { SearchIcon } from '@primer/octicons-react';
import { iconStyle, inputStyle, rootStyle } from './style.css';

export type RepositorySearchBoxProps = {
  onSearch: (keyword: string) => void;
};

export const RepositorySearchBox = memo<RepositorySearchBoxProps>(
  ({ onSearch }) => {
    const [value, setValue] = useState('');

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.code === 'Enter') {
        onSearch(value);
      }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    };

    return (
      <div className={rootStyle}>
        <SearchIcon size={16} className={iconStyle} />
        <input
          type="text"
          placeholder="Search repositories..."
          className={inputStyle}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      </div>
    );
  }
);
