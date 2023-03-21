// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { ReactElement, ReactNode } from 'react';
import {
  render,
  renderHook,
  RenderOptions,
  RenderResult,
} from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

export const customRenderHook: typeof renderHook = (hook, options) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <RecoilRoot>{children}</RecoilRoot>
  );

  return renderHook(hook, { wrapper, ...options });
};

type CustomRenderResult = RenderResult & {
  user: ReturnType<typeof userEvent.setup>;
};

export const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'queries'>
): CustomRenderResult => {
  const user = userEvent.setup();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <RecoilRoot>
      <MemoryRouter>{children}</MemoryRouter>
    </RecoilRoot>
  );

  const renderResult = render(ui, { wrapper, ...options });

  return {
    ...renderResult,
    user,
  };
};
