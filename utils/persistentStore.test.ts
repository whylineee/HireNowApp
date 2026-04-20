import { createPersistentStore } from '@/utils/persistentStore';
import { getStoredJson, setStoredJson } from '@/utils/storage';

jest.mock('@/utils/storage', () => ({
  getStoredJson: jest.fn(),
  setStoredJson: jest.fn(),
}));

const mockedGetStoredJson = getStoredJson as jest.MockedFunction<typeof getStoredJson>;
const mockedSetStoredJson = setStoredJson as jest.MockedFunction<typeof setStoredJson>;

describe('createPersistentStore', () => {
  beforeEach(() => {
    mockedGetStoredJson.mockReset();
    mockedSetStoredJson.mockReset();
    mockedSetStoredJson.mockResolvedValue(undefined);
  });

  it('hydrates from persisted state and emits updates', async () => {
    mockedGetStoredJson.mockResolvedValue(['saved']);
    const store = createPersistentStore<string[]>({
      key: 'favorites',
      initialState: [],
    });

    const listener = jest.fn();
    store.subscribe(listener);

    await store.hydrate();

    expect(listener).toHaveBeenNthCalledWith(1, []);
    expect(listener).toHaveBeenNthCalledWith(2, ['saved']);
    expect(store.getSnapshot()).toEqual(['saved']);
  });

  it('updates state optimistically before persistence resolves', async () => {
    let resolvePersist: () => void = () => {};
    mockedSetStoredJson.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolvePersist = resolve;
        })
    );
    mockedGetStoredJson.mockResolvedValue([]);

    const store = createPersistentStore<string[]>({
      key: 'favorites',
      initialState: [],
    });

    const listener = jest.fn();
    store.subscribe(listener);
    const pendingPersist = store.setState(['job-1']);

    expect(store.getSnapshot()).toEqual(['job-1']);
    expect(listener).toHaveBeenLastCalledWith(['job-1']);

    resolvePersist();
    await pendingPersist;
    expect(mockedSetStoredJson).toHaveBeenCalledWith('favorites', ['job-1']);
  });

  it('merges hydrated state when mergeHydratedState is provided', async () => {
    mockedGetStoredJson.mockResolvedValue({ darkMode: true, language: 'uk' });

    const store = createPersistentStore<{ darkMode: boolean; language: string }>({
      key: 'preferences',
      initialState: { darkMode: false, language: 'en' },
      mergeHydratedState: (current, persisted) => ({
        ...current,
        ...persisted,
      }),
    });

    await store.hydrate();

    expect(store.getSnapshot()).toEqual({ darkMode: true, language: 'uk' });
  });
});
