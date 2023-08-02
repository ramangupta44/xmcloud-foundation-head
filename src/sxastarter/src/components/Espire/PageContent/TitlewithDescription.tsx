import React from 'react';
import {
  Field,
  RichText,
  RichTextField,
  Text,
  withDatasourceCheck,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';

type TitleDescriptionProps = ComponentProps & {
  params: { [key: string]: string };
  fields: {
    Title: Field<string>;
    Description: RichTextField;
  };
};
export const TitlewithDescription = (props: TitleDescriptionProps): JSX.Element => {
  return (
    <div className={`title-description ${props.params.styles}`}>
      <Text tag="h2" field={props?.fields?.Title} />
      <RichText field={props?.fields?.Description}></RichText>
    </div>
  );
};

export default withDatasourceCheck()<TitleDescriptionProps>(TitlewithDescription);
