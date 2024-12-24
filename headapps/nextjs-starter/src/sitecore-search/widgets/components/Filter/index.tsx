import { useSearchResultsActions, useSearchResultsSelectedFilters } from '@sitecore-search/react';

import styles from './styles.module.css';

// Import or define FacetPayloadType
import type { FacetPayloadType } from '@sitecore-search/react';

// Define the type for selected facets
type SelectedFacet = {
  min?: number;
  max?: number;
  valueLabel?: string;
  facetId: string;
  facetLabel: string;
  type: FacetPayloadType; // Ensure `type` matches the expected FacetPayloadType
};

const buildRangeLabel = (min: number | undefined, max: number | undefined): string => {
  return typeof min === 'undefined'
    ? `< $${max}`
    : typeof max === 'undefined'
    ? ` > $${min}`
    : `$${min} - $${max}`;
};

const buildFacetLabel = (selectedFacet: SelectedFacet) => {
  if ('min' in selectedFacet || 'max' in selectedFacet) {
    return `${buildRangeLabel(selectedFacet.min, selectedFacet.max)}`;
  }
  return selectedFacet.valueLabel ?? '';
};

const Filters = () => {
  const selectedFacetsFromApi = useSearchResultsSelectedFilters() as SelectedFacet[];

  const { onRemoveFilter, onClearFilters } = useSearchResultsActions();

  return selectedFacetsFromApi.length > 0 ? (
    <div className={styles['sitecore-filter-container']}>
      <div className={styles['sitecore-filter-header-container']}>
        <h3 className={styles['sitecore-filter-header']}>Filters</h3>
        <button onClick={onClearFilters} className={styles['sitecore-clear-filters']}>
          Clear Filters
        </button>
      </div>
      <div className={styles['sitecore-selected-filters-list']}>
        {selectedFacetsFromApi.map((selectedFacet) => (
          <button
            key={`${selectedFacet.facetId}${selectedFacet.facetLabel}${selectedFacet.valueLabel}`}
            onClick={() => {
              // Ensure `type` is defined and matches FacetPayloadType
              onRemoveFilter({
                ...selectedFacet,
                type: selectedFacet.type ?? 'default', // Provide a fallback for type
              });
            }}
            className={styles['sitecore-selected-filters-list-item']}
          >
            {buildFacetLabel(selectedFacet)}
          </button>
        ))}
      </div>
    </div>
  ) : (
    <></>
  );
};

export default Filters;
