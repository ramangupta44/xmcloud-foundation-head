import { Field } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';
export type MapComponentTemplateProps = ComponentProps & {
  params: { [key: string]: string };
  fields: {
    LocationName: Field<string>;
    LocationLatitude: Field<string>;
    LocationLongitude: Field<string>;
  };
};
