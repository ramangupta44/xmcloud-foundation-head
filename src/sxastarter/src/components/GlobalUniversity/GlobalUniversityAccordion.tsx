import React from 'react';
import { Field, RichText, Text, withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';
import Accordion from 'react-bootstrap/Accordion';

type GlobalUniversityAccordionProps = ComponentProps & {
  params: { [key: string]: string };
  fields: {
    items: Accordion[];
  };
};

type AccordionData = {
  fields: {
    Title: Field<string>;
    Description: Field<string>;
  };
};

type Accordion = {
  fields: {
    Title: Field<string>;
    Content: AccordionData[];
  };
};
export const GlobalUniversityAccordion = (props: GlobalUniversityAccordionProps): JSX.Element => {
  return (
    <div className={`container accordion ${props.params.styles}`}>
      <Accordion>
        {props?.fields?.items?.map((item, index) => {
          return (
            <Accordion.Item eventKey={index as unknown as string} key={index}>
              <Accordion.Header>
                <Text field={item?.fields?.Title} tag="h6" />
              </Accordion.Header>
              {item?.fields?.Content?.map((body, index) => {
                return (
                  <Accordion.Body key={index}>
                    <Text field={body?.fields?.Title} tag="div" />
                    <RichText field={body?.fields?.Description} />
                  </Accordion.Body>
                );
              })}
            </Accordion.Item>
          );
        })}
      </Accordion>
    </div>
  );
};
export default withDatasourceCheck()<GlobalUniversityAccordionProps>(GlobalUniversityAccordion);
