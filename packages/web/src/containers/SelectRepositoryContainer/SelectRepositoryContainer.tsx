import { memo, useCallback, useState } from 'react';
import { useSetting } from '@/stores';
import { SelectRepositoryList } from './SelectRepositoryList';
import { SearchRepository } from '../../components';
import { Repository } from '../../hooks/useSearchRepository';
import { repositoryListWrapperStyle } from './style.css';

export const SelectRepositoryContainer = memo(() => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const { setting, addSubscribedRepository, removeSubscribedRepository } =
    useSetting();

  const handleSearch = useCallback((repositories: Repository[]) => {
    setRepositories(repositories);
  }, []);

  return (
    <div>
      <SearchRepository onSearch={handleSearch} />
      {repositories.length > 0 && (
        <div className={repositoryListWrapperStyle}>
          <SelectRepositoryList
            repositories={repositories}
            subscribedRepositories={setting.subscribedRepositories}
            addRepository={addSubscribedRepository}
            removeRepository={removeSubscribedRepository}
          />
        </div>
      )}
    </div>
  );
});
