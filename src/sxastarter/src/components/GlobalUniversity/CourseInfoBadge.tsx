import React from 'react';
import { Text, useSitecoreContext, Field } from '@sitecore-jss/sitecore-jss-nextjs';

interface Fields {
  Title: Field<string>;
}

type CourseInfoBadgeProps = {
  params: { [key: string]: string };
  fields: Fields;
};

type ComponentCourseInfoBadgeProps = {
  id: string;
  styles: string;
  children: JSX.Element;
};

const ComponentCourseInfoBadge = (props: ComponentCourseInfoBadgeProps) => {
  const id = props.id;
  return (
    <div className={`component courseinfobadge ${props.styles}`} id={id ? id : undefined}>
      <div className="component-courseinfobadge">
        <div className="field-courseinfobadge">{props.children}</div>
      </div>
    </div>
  );
};

export const Default = (props: CourseInfoBadgeProps): JSX.Element => {
  const { sitecoreContext } = useSitecoreContext();
  const id = props?.params?.RenderingIdentifier;

  if (!(props?.fields && props?.fields?.Title) && !sitecoreContext?.route?.fields?.Title) {
    return (
      <div
        className={`component courseinfobadge ${props?.params?.styles}`}
        id={id ? id : undefined}
      >
        <div className="component-courseinfobadge">
          <div className="field-courseinfobadge">[CourseDescription]</div>
        </div>
      </div>
    );
  }

  const field = (
    props?.fields && props?.fields?.Title
      ? props?.fields?.Title
      : sitecoreContext?.route?.fields?.Title
  ) as Field<string>;

  return (
    <ComponentCourseInfoBadge styles={props?.params?.styles} id={id}>
      <div className={`component courseinfobadge ${props.params.styles}`} id={id ? id : undefined}>
        <div className="component-courseinfobadge">
          <Text field={field} tag="h6" className="field-title" />
        </div>
      </div>
    </ComponentCourseInfoBadge>
  );
};
export const Badge = (props: CourseInfoBadgeProps): JSX.Element => {
  const { sitecoreContext } = useSitecoreContext();
  const id = props?.params?.RenderingIdentifier;

  if (!(props?.fields && props?.fields?.Title) && !sitecoreContext?.route?.fields?.Title) {
    return (
      <div
        className={`component courseinfobadge ${props?.params?.styles}`}
        id={id ? id : undefined}
      >
        <div className="component-courseinfobadge badge">
          <div className="field-courseinfobadge badge">[CourseDescription]</div>
        </div>
      </div>
    );
  }

  const field = (
    props?.fields && props?.fields?.Title
      ? props?.fields?.Title
      : sitecoreContext?.route?.fields?.Title
  ) as Field<string>;

  return (
    <ComponentCourseInfoBadge styles={props?.params?.styles} id={id}>
      <div
        className={`component courseinfobadge badge ${props.params.styles}`}
        id={id ? id : undefined}
      >
        <div className="component-courseinfobadge badge blog-category">
          <Text field={field} tag="h6" className="field-title" />
        </div>
      </div>
    </ComponentCourseInfoBadge>
  );
};
