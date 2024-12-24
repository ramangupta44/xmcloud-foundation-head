import type { ActionProp, ItemClickedAction } from '@sitecore-search/core';
import { ArticleCard } from '@sitecore-search/ui';

import styles from './styles.module.css';

const DEFAULT_IMG_URL = 'https://placehold.co/500x300?text=No%20Image'; // TODO: Update with corresponding fallback image

// Define the type for the article object
type Article = {
  id: string;
  image_url?: string;
  title?: string;
  name?: string;
  author?: string;
  description?: string;
  source_id?: string;
  url: string;
};

type ArticleCardItemCardProps = {
  article: Article; // Replace `any` with `Article` type
  onItemClick: ActionProp<ItemClickedAction>;
  index: number;
};

const ArticleHorizontalCard = ({ article, onItemClick, index }: ArticleCardItemCardProps) => {
  return (
    <ArticleCard.Root key={article.id} className={styles['sitecore-article-root']}>
      <div className={styles['sitecore-article-image-wrapper']}>
        <ArticleCard.Image
          src={article.image_url || DEFAULT_IMG_URL}
          className={styles['sitecore-article-image']}
        />
      </div>
      <ArticleCard.Content className={styles['sitecore-article-content']}>
        <a
          href={article.url}
          onClick={(e) => {
            e.preventDefault();
            onItemClick({
              id: article.id,
              index,
              sourceId: article.source_id,
            });
          }}
          className={styles['sitecore-article-link']}
        >
          <span aria-hidden="true" className={styles['sitecore-article-span']}></span>
          <ArticleCard.Title className={styles['sitecore-article-title']}>
            {article.title || article.name}
          </ArticleCard.Title>
        </a>
        {article.author && (
          <ArticleCard.Subtitle className={styles['sitecore-article-subtitle']}>
            {article.author}
          </ArticleCard.Subtitle>
        )}
        {article.description && (
          <div className={styles['sitecore-article-content-text']}>{article.description}</div>
        )}
      </ArticleCard.Content>
    </ArticleCard.Root>
  );
};

export default ArticleHorizontalCard;
