import React from 'react';
import type { ComponentStoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import { AccountSelect } from './AccountSelect';

export default {
  component: AccountSelect,
};

export const Default: ComponentStoryObj<typeof AccountSelect> = {
  args: {
    accounts: ['test1', 'test2'],
    onSelect: () => {
      return;
    },
  },
  render: (props) => {
    return (
      <div style={{ width: 300 }}>
        <AccountSelect {...props} />
      </div>
    );
  },
};

export const ClickButton: ComponentStoryObj<typeof AccountSelect> = {
  ...Default,
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button'));
  },
};

export const ClickAnotherAccount: ComponentStoryObj<typeof AccountSelect> = {
  ...Default,
  play: async (ctx) => {
    await ClickButton.play?.(ctx);
    const canvas = within(ctx.canvasElement);
    await userEvent.click(canvas.getByRole('option', { name: 'test2' }));
  },
};
