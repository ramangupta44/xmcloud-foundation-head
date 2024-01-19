import { ComponentProps } from 'lib/component-props';
import Form from 'react-bootstrap/Form';

const LanguageSelector = (props: ComponentProps): JSX.Element => {
  return (
    <div className={`${props.params.styles}`}>
      <div className="language-selector">
        <Form.Select aria-label="Default select example">
          <option>Select Language</option>
          <option value="1">English</option>
          <option value="2">French</option>
          <option value="3">German</option>
        </Form.Select>
      </div>
    </div>
  );
};

export const Login = (props: ComponentProps): JSX.Element => {
  return (
    <div className={`${props.params.styles}`}>
      <div className="login">
        <Form.Select aria-label="Login Functionality">
          <option>Login</option>
        </Form.Select>
      </div>
    </div>
  );
};
export default LanguageSelector;
