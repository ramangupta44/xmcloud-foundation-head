import { Field } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';

export type MapComponentProps = ComponentProps & {
  params: { [key: string]: string };
  className: string;
  fields: {
    Address: Field<string>;
  };
};
