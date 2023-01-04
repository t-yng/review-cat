import React, { memo, useCallback, useState } from 'react';
import { SelectRepositoryList } from './SelectRepositoryList';
import { SearchRepository } from '../../components';
import { Repository } from '../../hooks/useSearchRepository';
import { useSettings } from '../../hooks';
import { repositoryListWrapperStyle } from './style.css';

export const SelectRepositoryContainer = memo(() => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const { settings, addSubscribedRepository, removeSubscribedRepository } =
    useSettings();

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
            subscribedRepositories={settings.subscribedRepositories}
            addRepository={addSubscribedRepository}
            removeRepository={removeSubscribedRepository}
          />
        </div>
      )}
    </div>
  );
});
