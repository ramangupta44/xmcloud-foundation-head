import React from 'react';
import {
  RichText as JssRichText,
  useSitecoreContext,
  RichTextField,
} from '@sitecore-jss/sitecore-jss-nextjs';

interface Fields {
  CourseDescription: RichTextField;
}

type CourseLearningObjectivesProps = {
  params: { [key: string]: string };
  fields: Fields;
};

type ComponentCourseLearningObjectivesProps = {
  id: string;
  styles: string;
  children: JSX.Element;
};

const ComponentCourseLearningObjectives = (props: ComponentCourseLearningObjectivesProps) => {
  const id = props.id;
  return (
    <div className={`component courselearningobjectives ${props.styles}`} id={id ? id : undefined}>
      <div className="component-courselearningobjectives">
        <div className="field-courselearningobjectives">{props.children}</div>
      </div>
    </div>
  );
};

export const Default = (props: CourseLearningObjectivesProps): JSX.Element => {
  const { sitecoreContext } = useSitecoreContext();
  const id = props?.params?.RenderingIdentifier;

  if (
    !(props?.fields && props?.fields?.CourseDescription) &&
    !sitecoreContext?.route?.fields?.CourseDescription
  ) {
    return (
      <div
        className={`component courselearningobjectives ${props?.params?.styles}`}
        id={id ? id : undefined}
      >
        <div className="component-courselearningobjectives">
          <div className="field-courselearningobjectives">[CourseDescription]</div>
        </div>
      </div>
    );
  }

  const field = (
    props?.fields && props?.fields?.CourseDescription
      ? props?.fields?.CourseDescription
      : sitecoreContext?.route?.fields?.CourseDescription
  ) as RichTextField;

  return (
    <ComponentCourseLearningObjectives styles={props?.params?.styles} id={id}>
      <JssRichText field={field} />
    </ComponentCourseLearningObjectives>
  );
};
