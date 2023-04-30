import { test, expect } from '@playwright/test';
import jsonServer from 'json-server';
import { launchElectronApp } from './helpers/electron';
import { loginWithGitHub } from './helpers/login';
import { waitForLoadedImages } from './helpers/wait';
import { mockGitHubGraphQL } from './mock/graphql';
import { createSearchPullRequest } from './mock/graphql/pullRequest';
import { server } from './mock/server';
import { loginUser } from './mock/user';

test.describe('ホーム画面', () => {
  test.beforeAll(() => {
    server.listen();
  });

  test.afterAll(() => {
    server.close();
  });

  test('ログインユーザーがレビュアーとなっているプルリクエスト一覧を表示', async ({}, testInfo) => {
    const electronApp = await launchElectronApp();
    const mainWindow = await electronApp.firstWindow();

    // プルリクエスト一覧を取得するGraphQLのリクエストをモックする
    const anotherUser = {
      login: 'test',
      avatarUrl:
        'https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=test',
    };
    mockGitHubGraphQL({
      page: mainWindow,
      operation: 'SearchPullRequests',
      response: {
        body: {
          search: {
            // 自分がレビュアーとなっているプルリクエスト
            nodes: [
              // レビュー待ち
              createSearchPullRequest({
                headRefName: 'test/demo-1',
                title: 'レビュー待ちのプルリクエスト',
                url: 'https://github.com/t-yng/review-cat/pull/84',
                author: anotherUser,
                repository: {
                  nameWithOwner: 't-yng/review-cat',
                  openGraphImageUrl:
                    'https://opengraph.githubassets.com/cfa7f36a1d0cf1bc48993281104ae4a2eb8b697446bf53b5194ebcaee9f4723c/t-yng/review-cat',
                },
                reviewRequests: {
                  totalCount: 1,
                  nodes: [
                    {
                      requestedReviewer: {
                        __typename: 'User',
                        login: loginUser.login,
                      },
                    },
                  ],
                },
              }),
              // レビュー済み
              createSearchPullRequest({
                headRefName: 'test/demo-2',
                title: 'レビュー済みのプルリクエスト',
                url: 'https://github.com/t-yng/review-cat/pull/85',
                author: anotherUser,
                repository: {
                  nameWithOwner: 't-yng/review-cat',
                  openGraphImageUrl:
                    'https://opengraph.githubassets.com/cfa7f36a1d0cf1bc48993281104ae4a2eb8b697446bf53b5194ebcaee9f4723c/t-yng/review-cat',
                },
                reviews: {
                  nodes: [
                    {
                      __typename: 'PullRequestReview',
                      state: 'COMMENTED',
                      author: {
                        login: loginUser.login,
                      },
                    },
                  ],
                },
                reviewRequests: {
                  totalCount: 0,
                  nodes: [],
                },
              }),
              // 承認済み
              createSearchPullRequest({
                headRefName: 'test/demo-3',
                title: '承認済みのプルリクエスト',
                url: 'https://github.com/t-yng/review-cat/pull/86',
                author: anotherUser,
                repository: {
                  nameWithOwner: 't-yng/review-cat',
                  openGraphImageUrl:
                    'https://opengraph.githubassets.com/cfa7f36a1d0cf1bc48993281104ae4a2eb8b697446bf53b5194ebcaee9f4723c/t-yng/review-cat',
                },
                reviews: {
                  nodes: [
                    {
                      __typename: 'PullRequestReview',
                      state: 'COMMENTED',
                      author: {
                        login: loginUser.login,
                      },
                    },
                    {
                      __typename: 'PullRequestReview',
                      state: 'APPROVED',
                      author: {
                        login: loginUser.login,
                      },
                    },
                  ],
                },
                reviewRequests: {
                  totalCount: 0,
                  nodes: [],
                },
              }),
            ],
          },
        },
      },
    });

    // ログインする
    await loginWithGitHub(electronApp, server, {
      subscribedRepositories: ['t-yng/review-cat'],
    });

    await mainWindow.waitForURL('http://localhost:3000/');
    // 画像の読み込みを待つ
    await waitForLoadedImages(mainWindow);

    await expect(
      mainWindow.getByText('レビュー待ちのプルリクエスト')
    ).toBeVisible();
    await expect(
      mainWindow.getByText('レビュー待ち', { exact: true })
    ).toBeVisible();
    await expect(
      mainWindow.getByText('レビュー済みのプルリクエスト')
    ).toBeVisible();
    await expect(
      mainWindow.getByText('レビュー済み', { exact: true })
    ).toBeVisible();
    await expect(
      mainWindow.getByText('承認済みのプルリクエスト')
    ).toBeVisible();
    await expect(
      mainWindow.getByText('承認済み', { exact: true })
    ).toBeVisible();

    await expect(mainWindow).toHaveScreenshot(`${testInfo.title}.png`);
  });

  test('ログインユーザーが作成したプルリクエストの一覧を表示', async ({}, testInfo) => {
    const electronApp = await launchElectronApp();
    const mainWindow = await electronApp.firstWindow();

    // プルリクエスト一覧を取得するGraphQLのリクエストをモックする
    const anotherAuthor = {
      login: 'test',
      avatarUrl:
        'https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=test',
    };
    mockGitHubGraphQL({
      page: mainWindow,
      operation: 'SearchPullRequests',
      response: {
        body: {
          search: {
            // ログインユーザーが作成したプルリクエスト
            nodes: [
              // レビュー待ち
              createSearchPullRequest({
                headRefName: 'test/demo-1',
                title: 'レビュー待ちのプルリクエスト',
                url: 'https://github.com/t-yng/review-cat/pull/84',
                author: loginUser,
                repository: {
                  nameWithOwner: 't-yng/review-cat',
                  openGraphImageUrl:
                    'https://opengraph.githubassets.com/cfa7f36a1d0cf1bc48993281104ae4a2eb8b697446bf53b5194ebcaee9f4723c/t-yng/review-cat',
                },
                reviewRequests: {
                  totalCount: 1,
                  nodes: [
                    {
                      requestedReviewer: {
                        __typename: 'User',
                        login: anotherAuthor.login,
                      },
                    },
                  ],
                },
              }),
              // レビュー済み
              createSearchPullRequest({
                headRefName: 'test/demo-2',
                title: 'レビュー済みのプルリクエスト',
                url: 'https://github.com/t-yng/review-cat/pull/85',
                author: loginUser,
                repository: {
                  nameWithOwner: 't-yng/review-cat',
                  openGraphImageUrl:
                    'https://opengraph.githubassets.com/cfa7f36a1d0cf1bc48993281104ae4a2eb8b697446bf53b5194ebcaee9f4723c/t-yng/review-cat',
                },
                reviewDecision: null,
                reviews: {
                  nodes: [
                    {
                      __typename: 'PullRequestReview',
                      state: 'COMMENTED',
                      author: {
                        login: anotherAuthor.login,
                      },
                    },
                  ],
                },
                reviewRequests: {
                  totalCount: 0,
                  nodes: [],
                },
              }),
              // 承認済み
              createSearchPullRequest({
                headRefName: 'test/demo-3',
                title: '承認済みのプルリクエスト',
                url: 'https://github.com/t-yng/review-cat/pull/86',
                author: loginUser,
                repository: {
                  nameWithOwner: 't-yng/review-cat',
                  openGraphImageUrl:
                    'https://opengraph.githubassets.com/cfa7f36a1d0cf1bc48993281104ae4a2eb8b697446bf53b5194ebcaee9f4723c/t-yng/review-cat',
                },
                reviewDecision: 'APPROVED',
                reviews: {
                  nodes: [
                    {
                      __typename: 'PullRequestReview',
                      state: 'COMMENTED',
                      author: {
                        login: anotherAuthor.login,
                      },
                    },
                    {
                      __typename: 'PullRequestReview',
                      state: 'APPROVED',
                      author: {
                        login: anotherAuthor.login,
                      },
                    },
                  ],
                },
                reviewRequests: {
                  totalCount: 0,
                  nodes: [],
                },
              }),
            ],
          },
        },
      },
    });

    // ログインする
    await loginWithGitHub(electronApp, server, {
      subscribedRepositories: ['t-yng/review-cat'],
    });

    await mainWindow.waitForURL('http://localhost:3000/');
    // 画像の読み込みを待つ
    await waitForLoadedImages(mainWindow);

    await expect(
      mainWindow.getByText('レビュー待ちのプルリクエスト')
    ).toBeVisible();
    await expect(
      mainWindow.getByText('レビュー待ち', { exact: true })
    ).toBeVisible();
    await expect(
      mainWindow.getByText('レビュー済みのプルリクエスト')
    ).toBeVisible();
    await expect(
      mainWindow.getByText('レビュー済み', { exact: true })
    ).toBeVisible();
    await expect(
      mainWindow.getByText('承認済みのプルリクエスト')
    ).toBeVisible();
    await expect(
      mainWindow.getByText('承認済み', { exact: true })
    ).toBeVisible();

    await expect(mainWindow).toHaveScreenshot(`${testInfo.title}.png`);
  });
});
