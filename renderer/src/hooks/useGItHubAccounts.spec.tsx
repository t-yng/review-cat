import React, { ReactChild } from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { MockedProvider, MockedProviderProps } from '@apollo/client/testing';
import {
  SearchGitHubAccountsQueryResponse,
  SearchGitHubAccountsQuery,
  useGitHubAccounts,
} from './useGitHubAccounts';

const responseMock: SearchGitHubAccountsQueryResponse = {
  viewer: {
    login: 'test-user',
    organizations: {
      nodes: [
        {
          avatarUrl: 'https://test.com/images/1',
          login: 'test-organization',
        },
        {
          avatarUrl: 'https://test.com/images/2',
          login: 'test-organization2',
        },
      ],
    },
  },
};

const graphQLMocks: MockedProviderProps['mocks'] = [
  {
    request: { query: SearchGitHubAccountsQuery },
    result: {
      data: {
        ...responseMock,
      },
    },
  },
];

describe('useGitHubAccounts', () => {
  it('ログイン中のユーザーアカウントを一覧に含める', async () => {
    const wrapper = ({ children }: { children: ReactChild }) => (
      <MockedProvider mocks={graphQLMocks}>{children}</MockedProvider>
    );
    const { result, waitForNextUpdate } = renderHook(
      () => useGitHubAccounts(),
      { wrapper }
    );

    await waitForNextUpdate();

    expect(result.current.accounts).toContain(responseMock.viewer.login);
  });

  it('ログイン中のユーザーが所属する組織アカウントを一覧に含める', async () => {
    const wrapper = ({ children }: { children: ReactChild }) => (
      <MockedProvider mocks={graphQLMocks}>{children}</MockedProvider>
    );
    const { result, waitForNextUpdate } = renderHook(
      () => useGitHubAccounts(),
      { wrapper }
    );

    await waitForNextUpdate();

    const organizations = responseMock.viewer.organizations.nodes ?? [];
    for (const org of organizations) {
      expect(result.current.accounts).toContain(org?.login);
    }
  });
});
