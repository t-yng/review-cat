import { customRenderHook } from '@test/helpers/render';
import { storage } from '@/lib/storage';
import { act } from '@testing-library/react';
import { useAuth } from './useAuth';

jest.mock('@/lib/storage');
const storageMock = storage as jest.Mocked<typeof storage>;

describe('useAuth', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('トークンが保存済みの場合はログイン済みと判定する', () => {
    storageMock.getGithubAccessToken.mockReturnValue('token');
    const { result } = customRenderHook(() => useAuth());

    expect(result.current.isLoggedIn).toBe(true);
  });

  it('トークンが保存されていない場合はログイン済みと判定しない', () => {
    storageMock.getGithubAccessToken.mockReturnValue(null);
    const { result } = customRenderHook(() => useAuth());

    expect(result.current.isLoggedIn).toBe(false);
  });

  it('ログインした時にトークンを保存して、ユーザー情報を取得する', async () => {
    const token = 'abcd123';
    jest.spyOn(window.ipc, 'getAccessToken').mockResolvedValue(token);
    const callbackMock = jest.fn();
    const { result } = customRenderHook(() => useAuth());

    await act(async () => {
      await result.current.signIn(callbackMock);
    });

    expect(storageMock.setGithubAccessToken).toBeCalledWith(token);
    expect(callbackMock).toBeCalled();
    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.loginUser).not.toBeNull();
  });

  it('ログアウトした時にトークンとユーザー情報を削除', async () => {
    const callbackMock = jest.fn();
    const { result } = customRenderHook(() => useAuth());

    // ログイン状態にする
    await act(async () => {
      await result.current.signIn(callbackMock);
    });

    // ログアウト
    await act(async () => {
      await result.current.signOut(callbackMock);
    });

    expect(storageMock.removeGitHubAccessToken).toBeCalled();
    expect(callbackMock).toBeCalled();
    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.loginUser).toBeNull();
  });
});
