import React from 'react';
import { BannerTemplateProps } from 'lib/component-props/EspireTemplateProps/PageContent/BannerTemplateProps';

import {
  Link as JssLink,
  RichText as JssRichText,
  NextImage,
  Text,
  withDatasourceCheck,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { EditMode } from 'lib/component-props';

export const Banner = (props: BannerTemplateProps): JSX.Element => {
  const isEditMode = EditMode();
  return (
    <div className={`banner ${props.params.styles} ${props?.className}`}>
      <section className={`banner-default`}>
        <NextImage field={props?.fields?.Image} />
        <div className="container">
          <div className="banner-content">
            <Text tag="h1" field={props?.fields?.Title} />
            <JssRichText field={props?.fields?.Description} tag="p" />
            {isEditMode ? (
              <JssLink field={props?.fields?.Link} className="primary-btn" />
            ) : props?.fields?.Link?.value?.href ? (
              <JssLink field={props?.fields?.Link} className="primary-btn" />
            ) : (
              ''
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default withDatasourceCheck()<BannerTemplateProps>(Banner);

export const BannerWithOverlay = (props: BannerTemplateProps): JSX.Element => {
  return <Banner {...props} className={'banner-with-overlay'} />;
};
