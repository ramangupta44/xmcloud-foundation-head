import {
  Link,
  LinkField,
  Text,
  TextField,
  useSitecoreContext,
} from '@sitecore-jss/sitecore-jss-nextjs';
import React from 'react';

interface Fields {
  data: {
    datasource: {
      url: {
        path: string;
        siteName: string;
      };
      field: {
        jsonValue: {
          value: string;
          editable?: string;
          metadata?: { [key: string]: unknown };
        };
      };
    };
    contextItem: {
      url: {
        path: string;
        siteName: string;
      };
      field: {
        jsonValue: {
          value: string;
          editable?: string;
          metadata?: { [key: string]: unknown };
        };
      };
    };
  };
}

type TitleProps = {
  params: { [key: string]: string };
  fields: Fields;
};

type ComponentContentProps = {
  id: string;
  styles: string;
  children: JSX.Element;
};

type TitleOnlyProps = TitleProps & ComponentContentProps;

const ComponentContent = (props: ComponentContentProps) => {
  const id = props.id;
  return (
    <div className={`component title ${props.styles}`} id={id ? id : undefined}>
      <div className="component-content">
        <div className="field-title">{props.children}</div>
      </div>
    </div>
  );
};

export const Default = (props: TitleProps): JSX.Element => {
  const datasource = props.fields?.data?.datasource || props.fields?.data?.contextItem;
  const { sitecoreContext } = useSitecoreContext();
  const text: TextField = datasource?.field?.jsonValue || {};
  const link: LinkField = {
    value: {
      href: datasource?.url?.path,
      title: datasource?.field?.jsonValue?.value,
    },
  };
  if (sitecoreContext.pageState !== 'normal') {
    link.value.querystring = `sc_site=${datasource?.url?.siteName}`;
    if (!text?.value) {
      text.value = 'Title field';
      link.value.href = '#';
    }
  }

  return (
    <ComponentContent styles={props.params.styles} id={props.params.RenderingIdentifier}>
      <>
        {sitecoreContext.pageEditing ? (
          <Text field={text} />
        ) : (
          <Link field={link}>
            <Text field={text} />
          </Link>
        )}
      </>
    </ComponentContent>
  );
};

export const TitleCenterAlign = (props: TitleOnlyProps): JSX.Element => {
  const id = props.id;
  const datasource = props.fields?.data?.datasource || props.fields?.data?.contextItem;
  const { sitecoreContext } = useSitecoreContext();

  const text: TextField = {
    value: datasource?.field?.jsonValue?.value,
    editable: datasource?.field?.jsonValue?.editable,
  };
  const link: LinkField = {
    value: {
      href: datasource?.url?.path,
      title: datasource?.field?.jsonValue?.value,
      editable: true,
    },
  };
  if (sitecoreContext.pageState !== 'normal') {
    link.value.querystring = `sc_site=${datasource?.url?.siteName}`;
    if (!text.value) {
      text.value = 'Title field';
      link.value.href = '#';
    }
  }

  return (
    <div className={`component title title-center-align ${props.styles}`} id={id ? id : undefined}>
      <div className="component-content">
        <Text field={text} tag="h1" className="field-title" />
      </div>
    </div>
  );
};

export const PageTitle = (props: TitleOnlyProps): JSX.Element => {
  const id = props.id;
  const datasource = props.fields?.data?.datasource || props.fields?.data?.contextItem;
  const { sitecoreContext } = useSitecoreContext();

  const text: TextField = {
    value: datasource?.field?.jsonValue?.value,
    editable: datasource?.field?.jsonValue?.editable,
  };

  if (sitecoreContext.pageState !== 'normal') {
    if (!text.value) {
      text.value = 'Title field';
    }
  }
  return (
    <div className={`component title page-title ${props?.params?.styles}`} id={id ? id : undefined}>
      <div className="component-content">
        <Text field={text} tag="h3" className="field-title" />
      </div>
    </div>
  );
};
