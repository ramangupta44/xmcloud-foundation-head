import type { AppProps } from 'next/app';
import { I18nProvider } from 'next-localization';
import { SitecorePageProps } from 'lib/page-props';
import Bootstrap from 'src/Bootstrap';
import { IsSearchEnabled, SEARCH_CONFIG } from 'lib/sitecore-search/search';
import { WidgetsProvider } from '@sitecore-search/react';
import 'assets/main.scss';

import { createTheme } from '@sitecore-search/ui';
import { ReactNode } from 'react';

const SearchWrapper = ({ children }: { children: ReactNode }) =>
  IsSearchEnabled() ? (
    <WidgetsProvider {...SEARCH_CONFIG}>{children}</WidgetsProvider>
  ) : (
    <>{children}</>
  );

function App({ Component, pageProps }: AppProps<SitecorePageProps>): JSX.Element {
  const { dictionary, ...rest } = pageProps;
  const myTheme = createTheme();
  return (
    <>
      <div style={myTheme.style}>
        <SearchWrapper>
          <Bootstrap {...pageProps} />
          {/*
        // Use the next-localization (w/ rosetta) library to provide our translation dictionary to the app.
        // Note Next.js does not (currently) provide anything for translation, only i18n routing.
        // If your app is not multilingual, next-localization and references to it can be removed.
      */}
          <I18nProvider lngDict={dictionary} locale={pageProps.locale}>
            <Component {...rest} />
          </I18nProvider>
        </SearchWrapper>
      </div>
    </>
  );
}

export default App;
