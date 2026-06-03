import { test, expect } from '@playwright/test';
import { launchElectronApp } from './helpers/electron';
import { loginWithGitHub } from './helpers/login';
import { waitForRenderedImages } from './helpers/wait';
import { mockGitHubGraphQL } from './mock/graphql';
import { createSearchPullRequest } from './mock/graphql/pullRequest';
import { server } from './mock/server';
import { loginUser } from './mock/user';

test.describe('Home screen', () => {
  test.beforeAll(() => {
    server.listen();
  });

  test.afterAll(() => {
    server.close();
  });

  test('Displays list of pull requests where the logged-in user is a reviewer', async ({}, testInfo) => {
    const electronApp = await launchElectronApp();
    const mainWindow = await electronApp.firstWindow();

    // Mock the GraphQL request to fetch the pull request list
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
            // Pull requests where self is a reviewer
            nodes: [
              // Waiting for review
              createSearchPullRequest({
                headRefName: 'test/demo-1',
                title: 'Waiting for review pull request',
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
              // Reviewed
              createSearchPullRequest({
                headRefName: 'test/demo-2',
                title: 'Reviewed pull request',
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
              // Approved
              createSearchPullRequest({
                headRefName: 'test/demo-3',
                title: 'Approved pull request',
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

    // Log in
    await loginWithGitHub(electronApp, server, {
      subscribedRepositories: ['t-yng/review-cat'],
    });

    await mainWindow.waitForURL('http://localhost:3000/');
    // Wait for images to load
    await waitForRenderedImages(mainWindow);

    await expect(
      mainWindow.getByText('Waiting for review pull request')
    ).toBeVisible();
    await expect(
      mainWindow.getByText('Waiting for review', { exact: true })
    ).toBeVisible();
    await expect(
      mainWindow.getByText('Reviewed pull request')
    ).toBeVisible();
    await expect(
      mainWindow.getByText('Reviewed', { exact: true })
    ).toBeVisible();
    await expect(
      mainWindow.getByText('Approved pull request')
    ).toBeVisible();
    await expect(
      mainWindow.getByText('Approved', { exact: true })
    ).toBeVisible();

    await expect(mainWindow).toHaveScreenshot(`${testInfo.title}.png`);
  });

  test('Displays list of pull requests created by the logged-in user', async ({}, testInfo) => {
    const electronApp = await launchElectronApp();
    const mainWindow = await electronApp.firstWindow();

    // Mock the GraphQL request to fetch the pull request list
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
            // Pull requests created by the logged-in user
            nodes: [
              // Waiting for review
              createSearchPullRequest({
                headRefName: 'test/demo-1',
                title: 'Waiting for review pull request',
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
              // Reviewed
              createSearchPullRequest({
                headRefName: 'test/demo-2',
                title: 'Reviewed pull request',
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
              // Approved
              createSearchPullRequest({
                headRefName: 'test/demo-3',
                title: 'Approved pull request',
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

    // Log in
    await loginWithGitHub(electronApp, server, {
      subscribedRepositories: ['t-yng/review-cat'],
    });

    await mainWindow.waitForURL('http://localhost:3000/');
    // Wait for images to load
    await waitForRenderedImages(mainWindow);

    await expect(
      mainWindow.getByText('Waiting for review pull request')
    ).toBeVisible();
    await expect(
      mainWindow.getByText('Waiting for review', { exact: true })
    ).toBeVisible();
    await expect(
      mainWindow.getByText('Reviewed pull request')
    ).toBeVisible();
    await expect(
      mainWindow.getByText('Reviewed', { exact: true })
    ).toBeVisible();
    await expect(
      mainWindow.getByText('Approved pull request')
    ).toBeVisible();
    await expect(
      mainWindow.getByText('Approved', { exact: true })
    ).toBeVisible();

    await expect(mainWindow).toHaveScreenshot(`${testInfo.title}.png`);
  });
});
