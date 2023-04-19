import { _electron as electron } from 'playwright';
import { test, expect } from '@playwright/test';
import jsonServer from 'json-server';
import { hasOperationName } from './utils/gaphql';

const server = jsonServer.create();
server.use(jsonServer.bodyParser);

test.beforeAll(() => {
  server.listen(4400);
});

test('GitHubでログインできる', async () => {
  // アプリを起動
  const electronApp = await electron.launch({
    args: [require.resolve('main/dist/app.js')],
  });

  // メインプロセスのログを出力
  const mainProcess = electronApp.process();
  mainProcess.stdout?.on('data', (data) => {
    console.log(data.toString());
  });

  // ウィンドウのコンソールログを出力
  const mainWindow = await electronApp.firstWindow();
  mainWindow.on('console', console.log);

  await mainWindow.evaluate(() => {
    // ログイン状態を初期化
    window.localStorage.clear();

    // react-routerのページ遷移を実行するために、ナビゲーションのイベントを発火
    window.history.pushState({}, '', '/');
  });

  // ログインボタンをクリック
  const loginButton = await mainWindow.getByRole('button', {
    name: 'Login To GitHub',
  });
  await loginButton.click();

  // 認証用のウィンドウを取得
  const authWindow = await electronApp.waitForEvent('window');
  await authWindow.waitForLoadState('domcontentloaded');

  // GitHub認証のページ遷移をモック
  await authWindow.route('https://github.com/authorized', (route) => {
    return route.fulfill({
      status: 302,
      headers: { Location: 'http://localhost?code=1234567890' },
    });
  });

  // GitHub認証のアクセストークン取得をモック
  server.post('/login/oauth/access_token', (req, res) => {
    if (req.body.code === '1234567890') {
      return res.status(200).json({
        access_token: 'mock_token',
      });
    } else {
      return res.status(401);
    }
  });

  // ユーザー情報の取得をモック
  mainWindow.route('https://api.github.com/graphql', (route) => {
    const body = route.request().postDataJSON();
    if (hasOperationName(body.query, 'LoginUser')) {
      return route.fulfill({
        status: 200,
        headers: {
          contentType: 'application/json',
        },
        body: JSON.stringify({
          data: {
            viewer: {
              login: 'test',
              avatarUrl:
                'https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=test',
            },
          },
        }),
      });
    }
  });

  // ユーザーがGitHubでのログインを完了した状態を再現
  try {
    await authWindow.goto('https://github.com/authorized', {
      waitUntil: 'commit',
    });
  } catch (error) {
    // アプリケーションの仕様として、認証後にリダイレクトされたURLから認証コードを取得したらウィンドウが閉じられる
    // ERROR_ABORTEDは正常な動作なので、エラーとして扱わない
    // それ以外のエラーは異常な動作なので、エラーとして扱う
    if (!error.message.includes('net::ERR_ABORTED')) {
      throw error;
    }
  }

  await expect(mainWindow.getByRole('img', { name: 'test' })).toBeVisible();
  await expect(mainWindow).toHaveURL(/\/select\-repository/);

  await electronApp.close();
});
