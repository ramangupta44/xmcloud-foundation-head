import type { SearchResponseSortChoice } from '@sitecore-search/data';
import { useSearchResultsActions } from '@sitecore-search/react';
import { SortSelect } from '@sitecore-search/ui';

import styles from './styles.module.css';

type SortOrderProps = {
  options: Array<SearchResponseSortChoice>;
  selected: string;
};

const sortLabels: Record<string, string> = {
  featured_asc: 'Alphabetical (A–Z)',
  featured_desc: 'Alphabetical (Z-A)',
  suggested: 'Relevance',
};

const SortOrder = ({ options, selected }: SortOrderProps) => {
  const selectedSortIndex = options.findIndex((s) => s.name === selected);
  const { onSortChange } = useSearchResultsActions();

  return (
    <SortSelect.Root defaultValue={options[selectedSortIndex]?.name} onValueChange={onSortChange}>
      <SortSelect.Trigger className={styles['sitecore-sort-select-trigger']}>
        <SortSelect.SelectValue className={styles['sitecore-sort-select-value']}>
          {selectedSortIndex > -1 ? sortLabels[options[selectedSortIndex].name.toLowerCase()] : ''}
        </SortSelect.SelectValue>
        <SortSelect.Icon className={styles['sitecore-sort-select-icon']} />
      </SortSelect.Trigger>
      <SortSelect.Content className={styles['sitecore-sort-select-content']}>
        <SortSelect.Viewport className={styles['sitecore-sort-select-viewport']}>
          {options.map((option: SearchResponseSortChoice) => (
            <SortSelect.Option
              value={option}
              key={option.name}
              className={styles['sitecore-sort-select-option']}
            >
              <SortSelect.OptionText className={styles['sitecore-sort-select-option-text']}>
                {sortLabels[option.name.toLowerCase()] || option.name}
              </SortSelect.OptionText>
            </SortSelect.Option>
          ))}
        </SortSelect.Viewport>
      </SortSelect.Content>
    </SortSelect.Root>
  );
};

export default SortOrder;
