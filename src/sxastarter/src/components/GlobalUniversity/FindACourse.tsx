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
    <div className={`${props.params.styles}`} id="find-a-course">
      <div className="container">
        <div className="find-a-course">
          <h4>Find a course </h4>
          <form className="row g-3">
            <div className=" col-md-3 col-xs-12">
              <input
                type="text"
                className="form-control"
                placeholder="Search by name..."
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-default"
              />
            </div>
            <div className=" col-md-3 col-xs-12">
              <select className="form-select" aria-label="Default select example">
                <option selected>Search by category</option>
                <option value="1">Program</option>
                <option value="2">Accounting</option>
                <option value="3">Administration & Business</option>
                <option value="4">Aged Care and Disability</option>
                <option value="5">Agriculture</option>
              </select>
            </div>
            <div className=" col-md-3 col-xs-12">
              <select className="form-select" aria-label="Default select example">
                <option selected>Select type</option>
                <option value="1">Accredited Courses</option>
                <option value="2">Courses</option>
                <option value="3">Short Courses</option>
                <option value="4">VETDSS courses</option>
                <option value="5">Apprentice/Traineeships</option>
              </select>
            </div>
            <div className=" col-md-3 col-xs-12">
              <button type="submit" className="btn btn-primary col-auto">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FindACourse;
