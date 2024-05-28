import { Field } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';

type Addresses = {
  fields: {
    Address: Field<string>;
  };
};

export type MapComponentProps = ComponentProps & {
  params: { [key: string]: string };
  className: string;
  fields: {
    AddressCollection: Addresses[];
  };
};
