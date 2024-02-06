import React from 'react';
import {
  useSitecoreContext,
  RichTextField,
  LinkField,
  RichText,
  Link,
} from '@sitecore-jss/sitecore-jss-nextjs';

interface Fields {
  CourseInclude: RichTextField;
  ApplyNowURL: LinkField;
}

type CourseApplyNowProps = {
  params: { [key: string]: string };
  fields: Fields;
};

type ComponentCourseApplyNowProps = {
  id: string;
  styles: string;
  children: JSX.Element;
};

const ComponentCourseApplyNow = (props: ComponentCourseApplyNowProps) => {
  const id = props?.id;
  return (
    <div className={`component courseapplynow ${props?.styles}`} id={id ? id : undefined}>
      <div className="component-courseapplynow">
        <div className="field-courseapplynow">{props?.children}</div>
      </div>
    </div>
  );
};

export const Default = (props: CourseApplyNowProps): JSX.Element => {
  const { sitecoreContext } = useSitecoreContext();
  const id = props?.params?.RenderingIdentifier;

  const CourseIncludeField = (props?.fields?.CourseInclude ??
    sitecoreContext?.route?.fields?.CourseInclude) as RichTextField;

  const ApplyNowURLField = (props?.fields?.ApplyNowURL ??
    sitecoreContext?.route?.fields?.ApplyNowURL) as LinkField;

  return (
    <ComponentCourseApplyNow styles={props?.params?.styles} id={id}>
      <div>
        <RichText field={CourseIncludeField} />
        <ul className="course-actions">
          <li>
            <Link field={ApplyNowURLField} className="btn btn-primary">
              Apply Now
            </Link>
          </li>
          <li>
            <button type="button" className="btn btn-secondary">
              Add to Favorites
            </button>
          </li>
        </ul>
      </div>
    </ComponentCourseApplyNow>
  );
};
