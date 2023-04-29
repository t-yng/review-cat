import { type ElectronApplication } from 'playwright';
import { mockGitHubGraphQL } from '../mock/graphql';

export const loginWithGitHub = async (
  electronApp: ElectronApplication,
  server: any,
  setting?: { [key: string]: any }
) => {
  // ウィンドウのコンソールログを出力
  const mainWindow = await electronApp.firstWindow();

  await mainWindow.evaluate((setting) => {
    // ログイン状態を初期化
    window.localStorage.clear();

    if (setting) {
      window.localStorage.setItem('settings', JSON.stringify(setting));
    }

    // react-routerのページ遷移を実行するために、ナビゲーションのイベントを発火
    window.history.pushState({}, '', '/');
  }, setting);

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
  mockGitHubGraphQL({
    page: mainWindow,
    operation: 'LoginUser',
    response: {
      body: {
        viewer: {
          login: 't-yng',
          avatarUrl:
            'https://avatars.githubusercontent.com/u/11068883?u=36aaadc6fa8cb52c40c67c348958a9bf2934261e&v=4',
        },
      },
    },
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
};
