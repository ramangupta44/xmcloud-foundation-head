import { ComponentProps } from 'lib/component-props';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import PreviewSearchList from '../../../sitecore-search/widgets/PreviewSearchList';

const SearchBox = (props: ComponentProps): JSX.Element => {
  return (
    <div className={`search-bar-default ${props.params.styles}`}>
      <PreviewSearchList rfkId="rfkid_6" defaultItemsPerPage={5} />
    </div>
  );
};

export const SearchIcon = (props: ComponentProps): JSX.Element => {
  return (
    <div className={`footer-search-bar ${props.params.styles}`}>
      <div className="search-bar">
        <InputGroup>
          <Button variant="outline-secondary" id="search-btn">
            <i className="fa fa-search"></i>
          </Button>
        </InputGroup>
      </div>
    </div>
  );
};

export default SearchBox;
