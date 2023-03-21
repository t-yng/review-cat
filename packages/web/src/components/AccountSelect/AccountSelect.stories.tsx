import React from 'react';
import type { StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import { AccountSelect } from './AccountSelect';

export default {
  component: AccountSelect,
};

export const Default: StoryObj<typeof AccountSelect> = {
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

export const ClickButton: StoryObj<typeof AccountSelect> = {
  ...Default,
  play: ({ canvasElement }) => {
    userEvent.click(within(canvasElement).getByRole('button'));
  },
};

export const ClickAnotherAccount: StoryObj<typeof AccountSelect> = {
  ...Default,
  play: async (ctx) => {
    const canvas = within(ctx.canvasElement);
    ClickButton.play?.(ctx);
    const option = await canvas.findByRole('option', { name: 'test2' });
    userEvent.click(option);
  },
};
