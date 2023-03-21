import { ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
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
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MockedProvider mocks={graphQLMocks}>{children}</MockedProvider>
    );
    const { result } = renderHook(() => useGitHubAccounts(), { wrapper });

    // await waitForNextUpdate();

    await waitFor(() => {
      expect(result.current.accounts).toContain(responseMock.viewer.login);
    });
  });

  it('ログイン中のユーザーが所属する組織アカウントを一覧に含める', async () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MockedProvider mocks={graphQLMocks}>{children}</MockedProvider>
    );
    const { result } = renderHook(() => useGitHubAccounts(), { wrapper });

    await waitFor(() => {
      const organizations = responseMock.viewer.organizations.nodes ?? [];
      for (const org of organizations) {
        expect(result.current.accounts).toContain(org?.login);
      }
    });
  });
});
