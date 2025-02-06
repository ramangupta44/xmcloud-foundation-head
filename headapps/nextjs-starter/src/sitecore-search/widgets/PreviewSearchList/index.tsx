// This component was generated by @sitecore-search/cli on Thu Dec 05 2024 09:54:01 GMT+0530 (India Standard Time)
 
import type { ChangeEvent, SyntheticEvent } from 'react';
import { useCallback } from 'react';
import router from 'next/router';
import type { PreviewSearchInitialState } from '@sitecore-search/react';
import { WidgetDataType, usePreviewSearch, widget } from '@sitecore-search/react';
import { ArticleCard, Presence, PreviewSearch } from '@sitecore-search/ui';
 
import Spinner from '../components/Spinner/index';
import SuggestionBlock from '../components/SuggestionBlock/index';
import styles from './styles.module.css';
 
type ArticleModel = {
  id: string;
  author: string;
  name?: string;
  title?: string;
  image_url: string;
  url: string;
  source_id?: string;
  description: string;
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
 
export const PreviewSearchListComponent = ({ defaultItemsPerPage = 6 }: PreviewSearchListProps) => {
  const {
    widgetRef,
    actions: { onKeyphraseChange },
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
  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    const target = (e.target as HTMLFormElement).querySelector('input') as HTMLInputElement;
    router.push(`/SearchList?q=${target.value}`);
    target.value = '';
  };
 
  return (
    <PreviewSearch.Root>
      <form onSubmit={handleSubmit} className={styles['sitecore-preview-search-form']}>
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
                  {articles?.map((article: ArticleModel) => (
                    <PreviewSearch.Item
                      key={article.id}
                      asChild
                      className={styles['sitecore-preview-search-item']}
                    >
                      <a
                        href={article.url && article.url !== '#' ? article.url : ''}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles['sitecore-preview-search-link']}
                      >
                        <ArticleCard.Root className={styles['sitecore-article-root']}>
                          <ArticleCard.Title className={styles['sitecore-article-title']}>
                            {article.name || article.title}
                          </ArticleCard.Title>
                          <ArticleCard.Subtitle className={styles['sitecore-article-subtitle']}>
                            <div className={styles['sitecore-preview-detail']}>{article?.description}</div>
                          </ArticleCard.Subtitle>
                        </ArticleCard.Root>
                      </a>
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
 