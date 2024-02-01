import React from 'react';
import {
  Image as JssImage,
  useSitecoreContext,
  ImageField,
} from '@sitecore-jss/sitecore-jss-nextjs';

interface Fields {
  Image: ImageField;
}

type CourseImageProps = {
  params: { [key: string]: string };
  fields: Fields;
};

type ComponentCourseImageProps = {
  id: string;
  styles: string;
  children: JSX.Element;
};

const ComponentCourseImage = (props: ComponentCourseImageProps) => {
  const id = props.id;
  return (
    <div className={`component courseimage ${props.styles}`} id={id ? id : undefined}>
      <div className="component-courseimage">
        <div className="field-courseimage">{props.children}</div>
      </div>
    </div>
  );
};

export const Default = (props: CourseImageProps): JSX.Element => {
  const { sitecoreContext } = useSitecoreContext();
  const id = props?.params?.RenderingIdentifier;

  if (!(props?.fields && props?.fields?.Image) && !sitecoreContext?.route?.fields?.Image) {
    return (
      <div className={`component courseimage ${props?.params?.styles}`} id={id ? id : undefined}>
        <div className="component-courseimage">
          <div className="field-courseimage">[Image]</div>
        </div>
      </div>
    );
  }

  const field = (
    props?.fields && props?.fields?.Image
      ? props?.fields?.Image
      : sitecoreContext?.route?.fields?.Image
  ) as ImageField;

  return (
    <ComponentCourseImage styles={props?.params?.styles} id={id}>
      <JssImage field={field} />
    </ComponentCourseImage>
  );
};
