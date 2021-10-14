import React from 'react';
import { Dialog } from '@headlessui/react';
import { XIcon } from '@primer/octicons-react';
import { SelectRepositoryContainer } from '../../containers/SelectRepositoryContainer';
import {
  dialogStyle,
  overlayStyle,
  contentStyle,
  closeButtonStyle,
} from './style.css';

type SelectRepositoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const SelectRepositoryModal = React.memo<SelectRepositoryModalProps>(
  (props) => {
    return (
      <Dialog
        open={props.isOpen}
        onClose={props.onClose}
        className={dialogStyle}
      >
        <div className={contentStyle}>
          <button onClick={props.onClose} className={closeButtonStyle}>
            <XIcon />
          </button>
          <SelectRepositoryContainer />
        </div>
        <Dialog.Overlay className={overlayStyle} />
      </Dialog>
    );
  }
);
