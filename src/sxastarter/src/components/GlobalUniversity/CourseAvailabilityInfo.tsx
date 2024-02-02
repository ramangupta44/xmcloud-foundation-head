import React from 'react';
import { useSitecoreContext, Field } from '@sitecore-jss/sitecore-jss-nextjs';

interface Fields {
  CourseType: CourseType[];
  StudyMode: StudyMode[];
  AvailableSeat: Field<string>;
}
type CourseCategory = {
  fields: {
    [key: string]: {
      [key: string]: {
        [key: string]: string;
      };
    };
  };
};
type CourseType = CourseCategory;
type StudyMode = CourseCategory;

type CourseAvailabilityInfoProps = {
  params: { [key: string]: string };
  fields: Fields;
};

type ComponentCourseAvailabilityInfoProps = {
  id: string;
  styles: string;
  children: JSX.Element;
};

const ComponentCourseAvailabilityInfo = (props: ComponentCourseAvailabilityInfoProps) => {
  const id = props?.id;
  return (
    <div className={`component courseavailabilityinfo ${props?.styles}`} id={id ? id : undefined}>
      <div className="component-courseavailabilityinfo">
        <div className="field-courseavailabilityinfo">{props?.children}</div>
      </div>
    </div>
  );
};

export const Default = (props: CourseAvailabilityInfoProps): JSX.Element => {
  const { sitecoreContext } = useSitecoreContext();
  const id = props?.params?.RenderingIdentifier;

  const courseTypeField = (props?.fields?.CourseType ??
    sitecoreContext?.route?.fields?.CourseType) as CourseType[];

  const studyModeFields = (props?.fields?.StudyMode ??
    sitecoreContext?.route?.fields?.StudyMode) as StudyMode[];

  const availableSeatField = (props?.fields?.AvailableSeat ??
    sitecoreContext?.route?.fields?.AvailableSeat) as Field<string>;

  const courseTypeComponent = courseTypeField?.map((CourseType, index) => (
    <div key={index}>{CourseType?.fields?.Title?.value as unknown as string}</div>
  ));

  const studyModeComponents = studyModeFields?.map((studyMode, index) => (
    <div key={index}>{studyMode?.fields?.Title?.value as unknown as string}</div>
  ));

  const availableSeatComponent = (
    <div>{availableSeatField ? availableSeatField.value : '[Available Seat]'}</div>
  );

  return (
    <ComponentCourseAvailabilityInfo styles={props?.params?.styles} id={id}>
      <div className={`course-information ${props?.params?.styles}`} id={id}>
        <div className="course-information-cell">
          <span className="label">Course Type</span>
          <span className="value">{courseTypeComponent}</span>
        </div>
        <div className="course-information-cell">
          <span className="label">Mode Of Study</span>
          <span className="value">{studyModeComponents}</span>
        </div>
        <div className="course-information-cell">
          <span className="label">Available Seats</span>
          <span className="value">{availableSeatComponent}</span>
        </div>
      </div>
    </ComponentCourseAvailabilityInfo>
  );
};
