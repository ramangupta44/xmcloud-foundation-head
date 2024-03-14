import React from 'react';
import { Field, RichText, Text, withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';
import Accordion from 'react-bootstrap/Accordion';

type GlobalUniversityAccordionProps = ComponentProps & {
  params: { [key: string]: string };
  fields: {
    Title: Field<string>;
    Content: AccordionData[];
  };
};

type AccordionData = {
  fields: {
    Title: Field<string>;
    Description: Field<string>;
  };
};

export const GlobalUniversityAccordion = (props: GlobalUniversityAccordionProps): JSX.Element => {
  return (
    <div className={`container accordion ${props.params.styles}`}>
      <Text field={props?.fields?.Title} tag="h6" />
      <Accordion>
        {props?.fields?.Content?.map((item, itemIndex) => (
          <Accordion.Item eventKey={String(itemIndex)} key={itemIndex}>
            <Accordion.Header>
              <Text field={item?.fields?.Title} tag="h6" />
            </Accordion.Header>
            <Accordion.Body>
              <div>
                <RichText field={item?.fields?.Description} />
              </div>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
};
export default withDatasourceCheck()<GlobalUniversityAccordionProps>(GlobalUniversityAccordion);
