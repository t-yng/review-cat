import { vi, describe, it, expect, beforeEach, type Mocked } from 'vitest';
import { act } from '@testing-library/react';
import { customRenderHook } from '@test/helpers/render';
import { useRecoilState } from 'recoil';
import { Settings } from '@/models';
import { storage } from '@/lib/storage';
import { settingState } from './setting';

vi.mock('@/lib/storage');
const mockStorage = storage as Mocked<typeof storage>;

describe('stores/setting', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('When updating settings, the updated settings are saved to storage', () => {
    const { result } = customRenderHook(() => useRecoilState(settingState));

    const updated: Settings = {
      notifyReviewRequested: true,
      showsRequestedReviewPR: true,
      showsInReviewPR: true,
      showsApprovedPR: false,
      showsMyPR: false,
      autoLaunched: false,
      subscribedRepositories: ['test/test1', 'test/test2'],
    };
    act(() => {
      result.current[1](updated);
    });

    expect(mockStorage.setSettings).toHaveBeenCalledWith(updated);
  });
});
