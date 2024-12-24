// This component was generated by @sitecore-search/cli on Mon Dec 23 2024 16:23:58 GMT+0000 (Coordinated Universal Time)

import { useSearchResultsActions } from '@sitecore-search/react';
import { Select, SortSelect } from '@sitecore-search/ui';

import styles from './styles.module.css';

type ResultsPerPageProps = {
  defaultItemsPerPage: number;
};
const ResultsPerPage = ({ defaultItemsPerPage }: ResultsPerPageProps) => {
  const { onResultsPerPageChange } = useSearchResultsActions();
  return (
    <div>
      <label className="pr-1">Results Per Page</label>
      <Select.Root
        defaultValue={String(defaultItemsPerPage)}
        onValueChange={(v) =>
          onResultsPerPageChange({
            numItems: Number(v),
          })
        }
      >
        <Select.Trigger className={styles['sitecore-select-trigger']}>
          <Select.SelectValue />
          <Select.Icon />
        </Select.Trigger>
        <Select.Content className={styles['sitecore-select-content']}>
          <Select.Viewport className="p-1">
            <Select.SelectItem value="24" className={styles['sitecore-select-item']}>
              <SortSelect.OptionText>24</SortSelect.OptionText>
            </Select.SelectItem>
            <Select.SelectItem value="48" className={styles['sitecore-select-item']}>
              <SortSelect.OptionText>48</SortSelect.OptionText>
            </Select.SelectItem>
            <Select.SelectItem value="64" className={styles['sitecore-select-item']}>
              <SortSelect.OptionText>64</SortSelect.OptionText>
            </Select.SelectItem>
          </Select.Viewport>
        </Select.Content>
      </Select.Root>
    </div>
  );
};
export default ResultsPerPage;