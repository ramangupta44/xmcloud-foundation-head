// This component was generated by @sitecore-search/cli on Thu Dec 05 2024 09:54:01 GMT+0530 (India Standard Time)

import type { ChangeEvent } from 'react';
import { useCallback } from 'react';

import type { PreviewSearchInitialState } from '@sitecore-search/react';
import { WidgetDataType, usePreviewSearch, widget } from '@sitecore-search/react';
import { ArticleCard, Presence, PreviewSearch } from '@sitecore-search/ui';

import Spinner from '../components/Spinner/index';
import SuggestionBlock from '../components/SuggestionBlock/index';
import styles from './styles.module.css';

const DEFAULT_IMG_URL = 'https://placehold.co/500x300?text=No%20Image';
type ArticleModel = {
  id: string;
  author: string;
  name?: string;
  title?: string;
  image_url: string;
  url: string;
  source_id?: string;
};
type InitialState = PreviewSearchInitialState<'itemsPerPage' | 'suggestionsList'>;
interface PreviewSearchListProps {
  defaultItemsPerPage: number | 6;

  /**
   * An optional custom redirection handler that will be called when the user clicks on an article.
   * You can use your own redirection logic here, or any other side effect.
   * Examples
   * * (article: Article) => history.push(`/search?q=${article.id}`);
   * * (article: Article) => window.location.href = `/search?q=${article.id}`;
   * * (article: Article) => setRoute(`/custom/search/endpoint?q=${article.id}`);
   * @param article The article that was clicked.
   */
  itemRedirectionHandler?: (article: ArticleModel) => void;

  /**
   * An optional custom submit handler that will be called when the user submits the form by pressing the enter key.
   * You can use your own submit logic here, or any other side effect.
   * Most common use case is to redirect the user to a custom search page with the query string.
   * Examples
   * * (query: string) => history.push(`/search?q=${query}`);
   * * (query: string) => window.location.href = `/search?q=${query}`;
   * * (query: string) => setRoute(`/custom/search/endpoint?q=${query}`);
   * @param query The query string that was submitted.
   */
  submitRedirectionHandler?: (query: string) => void;
}
export const PreviewSearchListComponent = ({
  defaultItemsPerPage = 6,
  itemRedirectionHandler,
  submitRedirectionHandler,
}: PreviewSearchListProps) => {
  const {
    widgetRef,
    actions: { onItemClick, onKeyphraseChange },
    queryResult,
    queryResult: {
      isFetching,
      isLoading,
      data: { suggestion: { title_context_aware: articleSuggestions = [] } = {} } = {},
    },
  } = usePreviewSearch<ArticleModel, InitialState>({
    state: {
      suggestionsList: [
        {
          suggestion: 'title_context_aware',
          max: 3,
        },
      ],
      itemsPerPage: defaultItemsPerPage,
    },
  });
  const loading = isLoading || isFetching;
  const keyphraseHandler = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const target = event.target;
      onKeyphraseChange({
        keyphrase: target.value,
      });
    },
    [onKeyphraseChange]
  );
  return (
    <PreviewSearch.Root className={styles['sitecore-preview-search-root']}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const { value: query } = e.currentTarget.elements[0] as HTMLInputElement;
          submitRedirectionHandler && submitRedirectionHandler(query);
        }}
        className={styles['sitecore-preview-search-form']}
      >
        <PreviewSearch.Input
          onChange={keyphraseHandler}
          autoComplete="off"
          placeholder="Type to search..."
          className={styles['sitecore-preview-search-input']}
        />
      </form>
      <PreviewSearch.Content
        data-loading={loading}
        ref={widgetRef}
        className={styles['sitecore-preview-search-content']}
      >
        <Presence present={loading}>
          <Spinner />
        </Presence>
        <Presence present={!loading}>
          <>
            {articleSuggestions.length > 0 && (
              <PreviewSearch.Suggestions className={styles['sitecore-preview-search-suggestions']}>
                <SuggestionBlock
                  blockId={'title_context_aware'}
                  items={articleSuggestions}
                  title={'Suggestions'}
                  disabled={true}
                />
              </PreviewSearch.Suggestions>
            )}
            <PreviewSearch.Results defaultQueryResult={queryResult}>
              {({ data: { content: articles = [] } = {} }) => (
                <PreviewSearch.Items className={styles['sitecore-preview-search-items']}>
                  {articles.length > 0 && (
                    <>
                      <hr />
                      <h2 className={styles['sitecore-search-group-heading']}>Articles</h2>
                    </>
                  )}
                  {articles.map((article, index) => (
                    <PreviewSearch.Item
                      key={article.id}
                      asChild
                      className={styles['sitecore-preview-search-item']}
                    >
                      <PreviewSearch.ItemLink
                        href={article.url}
                        onClick={(e) => {
                          // onItemClick is for tracking purposes
                          onItemClick({
                            id: article.id,
                            index,
                            sourceId: article.source_id,
                          });
                          itemRedirectionHandler && itemRedirectionHandler(article);
                        }}
                        className={styles['sitecore-preview-search-link']}
                      >
                        <ArticleCard.Root className={styles['sitecore-article-root']}>
                          <div className={styles['sitecore-article-image-wrapper']}>
                            <ArticleCard.Image
                              src={article.image_url || DEFAULT_IMG_URL}
                              className={styles['sitecore-article-image']}
                            />
                          </div>
                          <section className={styles['sitecore-article-title-wrapper']}>
                            <ArticleCard.Title className={styles['sitecore-article-title']}>
                              {article.name || article.title}
                            </ArticleCard.Title>
                          </section>
                        </ArticleCard.Root>
                      </PreviewSearch.ItemLink>
                    </PreviewSearch.Item>
                  ))}
                </PreviewSearch.Items>
              )}
            </PreviewSearch.Results>
          </>
        </Presence>
      </PreviewSearch.Content>
    </PreviewSearch.Root>
  );
};
const PreviewSearchListWidget = widget(
  PreviewSearchListComponent,
  WidgetDataType.PREVIEW_SEARCH,
  'content'
);
export default PreviewSearchListWidget;
