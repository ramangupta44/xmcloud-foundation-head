import { Field } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';
// import Form from 'react-bootstrap/Form';

type FindACourseProps = ComponentProps & {
  params: { [key: string]: string };
  fields: {
    Title: Field<string>;
    Category: Category[];
  };
};
type Category = {
  fields: {
    [key: string]: {
      [key: string]: {
        [key: string]: string;
      };
    };
  };
};
const FindACourse = (props: FindACourseProps): JSX.Element => {
  console.log(props, 'props');
  return (
    <div className={`${props.params.styles}`}>
      <div className="language-selector">
        <form className="row g-3">
          <div className=" col-auto ">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name..."
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-default"
            />
          </div>
          <div className=" col-auto">
            <select className="form-select" aria-label="Default select example">
              <option selected>Search by category</option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
            </select>
          </div>
          <div className=" col-auto">
            <select className="form-select" aria-label="Default select example">
              <option selected>Select type</option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary col-auto">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default FindACourse;
