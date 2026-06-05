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

export const SelectRepositoryModal = ({
  isOpen,
  onClose,
}: SelectRepositoryModalProps) => (
  <Dialog open={isOpen} onClose={onClose} className={dialogStyle}>
    <div className={contentStyle}>
      <button onClick={onClose} className={closeButtonStyle}>
        <XIcon />
      </button>
      <SelectRepositoryContainer />
    </div>
    <div aria-hidden="true" className={overlayStyle} />
  </Dialog>
);
