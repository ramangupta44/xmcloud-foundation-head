import React from 'react';
import { BannerTemplateProps } from 'lib/component-props/EspireTemplateProps/PageContent/BannerTemplateProps';
import Image from 'next/image';
import {
  Link as JssLink,
  RichText as JssRichText,
  Text,
  withDatasourceCheck,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { EditMode } from 'lib/component-props';

export const Banner = (props: BannerTemplateProps): JSX.Element => {
  const isEditMode = EditMode();
  const imageWidth = Number(props?.fields?.Image?.value?.width) || undefined;
  const imageHeight = Number(props?.fields?.Image?.value?.height) || undefined;
  const imageUrl = props?.fields?.Image?.value?.src ?? 'defaultImageUrl';
  const imageAlt =
    typeof props?.fields?.Image?.value?.alt === 'string'
      ? props.fields.Image.value.alt
      : 'Default image description';
  return (
    <div className={`banner ${props.params.styles} ${props?.className}`}>
      <section className={`banner-default`}>
        <Image
          src={imageUrl}
          alt={imageAlt}
          width={imageWidth}
          height={imageHeight}
          layout="responsive"
          objectFit="cover"
          unoptimized={false}
        />
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
