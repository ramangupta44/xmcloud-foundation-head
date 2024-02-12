import React from 'react';
import { useSitecoreContext } from '@sitecore-jss/sitecore-jss-nextjs';
import moment from 'moment';
interface Fields {
  PublishingDate: string;
}

type BlogPostUpdateLogProps = {
  params: { [key: string]: string };
  fields: Fields;
};

type ComponentBlogPostUpdateLogProps = {
  id: string;
  styles: string;
  children: JSX.Element;
};

const ComponentBlogPostUpdateLog = (props: ComponentBlogPostUpdateLogProps) => {
  const id = props.id;
  return (
    <div className={`component blogpostupdatelog ${props.styles}`} id={id ? id : undefined}>
      <div className="component-blogpostupdatelog">
        <div className="field-blogpostupdatelog">{props.children}</div>
      </div>
    </div>
  );
};

export const Default = (props: BlogPostUpdateLogProps): JSX.Element => {
  const { sitecoreContext } = useSitecoreContext();
  const id = props?.params?.RenderingIdentifier;

  if (
    !(props?.fields && props?.fields?.PublishingDate) &&
    !sitecoreContext?.route?.fields?.PublishingDate
  ) {
    return (
      <div
        className={`component blogpostupdatelog ${props?.params?.styles}`}
        id={id ? id : undefined}
      >
        <div className="component-blogpostupdatelog">
          <div className="field-blogpostupdatelog">[PublishingDate]</div>
        </div>
      </div>
    );
  }

  const field = (
    props?.fields && props?.fields?.PublishingDate
      ? props?.fields?.PublishingDate
      : sitecoreContext?.route?.fields?.PublishingDate
  ) as string;
  const formattedDate = moment(field).format('dddd, DD MMM YYYY');
  return (
    <ComponentBlogPostUpdateLog styles={props?.params?.styles} id={id}>
      <div
        className={`component blogpostupdatelog ${props.params.styles}`}
        id={id ? id : undefined}
      >
        <div className="component-blogpostupdatelog">
          <div className="last-updated-container">
            <p className="field-publishingdate">
              <span>Last Updated: </span>
              {formattedDate}
            </p>
          </div>
        </div>
      </div>
    </ComponentBlogPostUpdateLog>
  );
};
