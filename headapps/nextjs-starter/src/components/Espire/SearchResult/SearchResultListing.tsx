import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import SearchResults from '../../../sitecore-search/widgets/SearchResultList';

const SearchResultListing = (): JSX.Element => {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    if (router.isReady) {
      const query = router.query.q as string;
      setKeyword(query || '');
    }
  }, [router.isReady, router.query.q]);
  return (
    <div>
      <SearchResults key={`${keyword}-search`} rfkId="rfkid_7" defaultKeyphrase={keyword} />
    </div>
  );
};

export default SearchResultListing;
