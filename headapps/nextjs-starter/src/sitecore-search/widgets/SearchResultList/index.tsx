import type { SearchResultsInitialState, SearchResultsStoreState } from '@sitecore-search/react';
import { WidgetDataType, useSearchResults, widget } from '@sitecore-search/react';

import ArticleItemCard from '../components/ArticleHorizontalCard';
import Filters from '../components/Filter';
import QueryResultsSummary from '../components/QueryResultsSummary';
import ResultsPerPage from '../components/ResultsPerPage';
import SearchFacets from '../components/SearchFacets';
import SearchPagination from '../components/SearchPagination';
import SortOptions from '../components/SortOrder';
import Spinner from '../components/Spinner';
import styles from './styles.module.css';

type ArticleModel = {
  id: string;
  author?: string;
  type?: string;
  title?: string;
  name?: string;
  subtitle?: string;
  url?: string; // Allow undefined in the model
  description?: string;
  content_text?: string;
  image_url?: string;
  source_id?: string;
};

type ArticleSearchResultsProps = {
  defaultSortType?: SearchResultsStoreState['sortType'];
  defaultPage?: SearchResultsStoreState['page'];
  defaultItemsPerPage?: SearchResultsStoreState['itemsPerPage'];
  defaultKeyphrase?: SearchResultsStoreState['keyphrase'];
};

type InitialState = SearchResultsInitialState<'itemsPerPage' | 'keyphrase' | 'page' | 'sortType'>;

export const SearchResultListComponent = ({
  defaultSortType = 'featured_desc',
  defaultPage = 1,
  defaultKeyphrase = '',
  defaultItemsPerPage = 24,
}: ArticleSearchResultsProps) => {
  const {
    widgetRef,
    actions: { onItemClick },
    state: { sortType, page, itemsPerPage },
    queryResult: {
      isLoading,
      isFetching,
      data: {
        total_item: totalItems = 0,
        sort: { choices: sortChoices = [] } = {},
        facet: facets = [],
        content: articles = [],
      } = {},
    },
  } = useSearchResults<ArticleModel, InitialState>({
    state: {
      sortType: defaultSortType,
      page: defaultPage,
      itemsPerPage: defaultItemsPerPage,
      keyphrase: defaultKeyphrase,
    },
  });

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div ref={widgetRef} className={styles['sitecore-wrapper']}>
      <div className={styles['sitecore-main-area']}>
        {isFetching && <Spinner />}
        {totalItems > 0 && (
          <>
            <section className={styles['sitecore-left-area']}>
              <Filters />
              <SearchFacets facets={facets} />
            </section>
            <section className={styles['sitecore-right-area']}>
              {/* Sort Select */}
              <section className={styles['sitecore-right-top-area']}>
                <QueryResultsSummary
                  currentPage={page}
                  itemsPerPage={itemsPerPage}
                  totalItems={totalItems}
                  totalItemsReturned={articles.length}
                />
                <SortOptions options={sortChoices} selected={sortType} />
              </section>

              {/* Results */}
              <div className={styles['sitecore-grid']}>
                {articles.map((a, index) => (
                  <ArticleItemCard
                    key={a.id || index} // Ensure a unique key
                    article={{
                      ...a,
                      url: a.url ?? '', // Provide a default value for undefined urls
                    }}
                    index={index}
                    onItemClick={onItemClick}
                  />
                ))}
              </div>
              <div className={styles['sitecore-page-controls']}>
                <ResultsPerPage defaultItemsPerPage={defaultItemsPerPage} />
                <SearchPagination currentPage={page} totalPages={totalPages} />
              </div>
            </section>
          </>
        )}
        {totalItems <= 0 && !isFetching && (
          <div className={styles['sitecore-no-results']}>
            <h3>No Results Found</h3>
          </div>
        )}
      </div>
    </div>
  );
};

const SearchResultListWidget = widget(
  SearchResultListComponent,
  WidgetDataType.SEARCH_RESULTS,
  'content'
);

export default SearchResultListWidget;
