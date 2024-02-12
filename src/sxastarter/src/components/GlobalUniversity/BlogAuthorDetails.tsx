import React from 'react';
import { Field, ImageField, useSitecoreContext } from '@sitecore-jss/sitecore-jss-nextjs';

interface Fields {
  Author: AuthorCategory[];
}
type AuthorCategory = {
  fields: {
    Title: Field<string>;
    Description: Field<string>;
    Image: ImageField;
  };
};

type BlogAuthorDetailsProps = {
  params: { [key: string]: string };
  fields: Fields;
};

type ComponentBlogAuthorDetailsProps = {
  id: string;
  styles: string;
  children: JSX.Element;
};

const ComponentBlogAuthorDetails = (props: ComponentBlogAuthorDetailsProps) => {
  const id = props?.id;
  return (
    <div className={`component blogauthordetails ${props?.styles}`} id={id ? id : undefined}>
      <div className="component-blogauthordetails">
        <div className="field-blogauthordetails">{props?.children}</div>
      </div>
    </div>
  );
};

export const Default = (props: BlogAuthorDetailsProps): JSX.Element => {
  const { sitecoreContext } = useSitecoreContext();
  const id = props?.params?.RenderingIdentifier;

  const authorCategoryField = (props?.fields?.Author ??
    sitecoreContext?.route?.fields?.Author) as AuthorCategory[];

  const authorDetailsComponent = authorCategoryField?.map((author, index) => {
    const altText =
      typeof author.fields.Image?.value?.alt === 'string'
        ? author.fields.Image.value.alt
        : 'Author image';

    return (
      <div key={index}>
        {author.fields.Image?.value?.src && (
          <img src={author.fields.Image.value.src} alt={altText} />
        )}
        <h2>{author.fields.Title.value}</h2>
        <p>{author.fields.Description.value}</p>
      </div>
    );
  });

  return (
    <ComponentBlogAuthorDetails styles={props?.params?.styles} id={id}>
      <div className={`BlogAuthor-information ${props?.params?.styles}`} id={id}>
        {authorDetailsComponent}
      </div>
    </ComponentBlogAuthorDetails>
  );
};
