import React from 'react';
import { Field, useSitecoreContext, withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';
import {
  LinkedinShareButton,
  LinkedinIcon,
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  InstapaperShareButton,
  InstagramIcon,
  PinterestShareButton,
  PinterestIcon,
} from 'next-share';

type SocialMediaShareProps = ComponentProps & {
  fields: {
    SocialShare: SocialShareData[];
  };
};

type SocialShareData = {
  fields: {
    ['Social Media Name']: Field<string>;
  };
};
export const SocialMediaShare = (props: SocialMediaShareProps): JSX.Element => {
  const pageURL = useSitecoreContext()?.sitecoreContext?.itemPath;
  return (
    <div className={`social-media-share ${props.params.styles}`}>
      <ul>
        {props?.fields?.SocialShare?.map((item, index) => {
          return (() => {
            if (item?.fields?.['Social Media Name']?.value?.toLocaleLowerCase() == 'linkedin') {
              return (
                <li key={index} className="linkedin">
                  <LinkedinShareButton url={process?.env?.PUBLIC_URL + (pageURL as string)}>
                    <LinkedinIcon size={32} round />
                  </LinkedinShareButton>
                </li>
              );
            } else if (
              item?.fields?.['Social Media Name']?.value?.toLocaleLowerCase() == 'facebook'
            ) {
              return (
                <li key={index} className="facebook">
                  <FacebookShareButton url={process?.env?.PUBLIC_URL + (pageURL as string)}>
                    <FacebookIcon size={32} round />
                  </FacebookShareButton>
                </li>
              );
            } else if (
              item?.fields?.['Social Media Name']?.value?.toLocaleLowerCase() == 'twitter'
            ) {
              return (
                <li key={index} className="twitter">
                  <TwitterShareButton url={process?.env?.PUBLIC_URL + (pageURL as string)}>
                    <TwitterIcon size={32} round />
                  </TwitterShareButton>
                </li>
              );
            } else if (
              item?.fields?.['Social Media Name']?.value?.toLocaleLowerCase() == 'instagram'
            ) {
              return (
                <li key={index} className="insta">
                  <InstapaperShareButton url={process?.env?.PUBLIC_URL + (pageURL as string)}>
                    <InstagramIcon size={32} round />
                  </InstapaperShareButton>
                </li>
              );
            } else if (
              item?.fields?.['Social Media Name']?.value?.toLocaleLowerCase() == 'pinterest'
            ) {
              return (
                <li key={index} className="pinterest">
                  <PinterestShareButton
                    url={process?.env?.PUBLIC_URL + (pageURL as string)}
                    media={pageURL as string}
                  >
                    <PinterestIcon size={32} round />
                  </PinterestShareButton>
                </li>
              );
            } else {
              return '';
            }
          })();
        })}
      </ul>
    </div>
  );
};

export default withDatasourceCheck()<SocialMediaShareProps>(SocialMediaShare);
