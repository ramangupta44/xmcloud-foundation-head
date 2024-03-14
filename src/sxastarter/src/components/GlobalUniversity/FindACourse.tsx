import { Field, LinkField, Link as JssLink } from '@sitecore-jss/sitecore-jss-nextjs';
import { useSearchParams } from 'next/navigation';
import { ComponentProps } from 'lib/component-props';
import Link from 'next/link';
import { useState } from 'react';
import { EditMode } from 'lib/component-props';

type FindACourseProps = ComponentProps & {
  params: { [key: string]: string };
  fields: {
    Title: Field<string>;
    CourseCategory: CourseCategory[];
    Link: LinkField;
    CourseType: CourseType[];
  };
};
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

const FindACourse = (props: FindACourseProps): JSX.Element => {
  const [category, setCategory] = useState(' ');
  const [type, setType] = useState(' ');
  const [text, setText] = useState('');
  const searchParams = useSearchParams();
  const isEdit = EditMode();
  const linkPath = props?.fields?.Link?.value?.href;
  const linkText = props?.fields?.Link?.value?.text;

  return (
    <div className={`${props?.params?.styles}`} id="find-a-course">
      <div className="container">
        <div className="find-a-course">
          <h4>Find a course </h4>
          <form className="row g-3">
            <div className=" col-md-3 col-xs-12">
              <input
                type="text"
                className="form-control"
                value={text}
                placeholder="Search by name..."
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-default"
                onChange={(e) => setText(e.target.value)}
              />
            </div>
            <div className=" col-md-3 col-xs-12">
              <select
                className="form-select"
                aria-label="Default select example"
                name={'category'}
                defaultValue={searchParams.get('category') as string}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value=" ">Search By Category</option>
                {props?.fields?.CourseCategory?.map((item, index) => {
                  return (
                    <option
                      key={index}
                      value={(item?.fields?.Title?.value as unknown as string).toLocaleLowerCase()}
                    >
                      {item?.fields?.Title?.value as unknown as string}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className=" col-md-3 col-xs-12">
              <select
                className="form-select"
                aria-label="Default select example"
                defaultValue={searchParams.get('type') as string}
                onChange={(e) => setType(e.target.value)}
              >
                <option value={' '}>Select Type</option>
                {props?.fields?.CourseType?.map((item, index) => {
                  return (
                    <option
                      key={index}
                      value={(item?.fields?.Title?.value as unknown as string).toLocaleLowerCase()}
                    >
                      {item?.fields?.Title?.value as unknown as string}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className=" col-md-3 col-xs-12">
              {isEdit ? (
                <JssLink field={props?.fields?.Link} className="btn btn-primary col-auto" />
              ) : (
                <Link
                  className="btn btn-primary col-auto"
                  href={{
                    pathname: `${linkPath?.toLocaleLowerCase()}`,
                    query: {
                      keyword: text,
                      category: category.toLocaleLowerCase(),
                      type: type.toLocaleLowerCase(),
                    },
                  }}
                >
                  {linkText}
                </Link>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FindACourse;
