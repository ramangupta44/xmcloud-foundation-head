const jssConfig = require('./src/temp/config');
const plugins = require('./src/temp/next-config-plugins') || {};
const headerConfig = require('./project-configs/header');
const publicUrl = jssConfig.publicUrl;

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // Set assetPrefix to our public URL
  assetPrefix: process.env.XMC_DEFAULT_RH === "true" ? publicUrl : undefined,
  //assetPrefix: publicUrl,

  // Allow specifying a distinct distDir when concurrently running app in a container
  distDir: process.env.NEXTJS_DIST_DIR || '.next',

  // Make the same PUBLIC_URL available as an environment variable on the client bundle
  env: {
    PUBLIC_URL: publicUrl,
  },

  i18n: {
    // These are all the locales you want to support in your application.
    // These should generally match (or at least be a subset of) those in Sitecore.
    locales: ['en'],
    // This is the locale that will be used when visiting a non-locale
    // prefixed path e.g. `/styleguide`.
    defaultLocale: jssConfig.defaultLanguage,
  },

  // Enable React Strict Mode
  reactStrictMode: true,

  // use this configuration to ensure that only images from the whitelisted domains
  // can be served from the Next.js Image Optimization API
  // see https://nextjs.org/docs/app/api-reference/components/image#remotepatterns
  images: {
    domains: ['edge.sitecorecloud.io'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'edge*.**',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'feaas*.blob.core.windows.net',
        port: '',
      },
    ],
  },

  async rewrites() {
    // When in connected mode we want to proxy Sitecore paths off to Sitecore
    return [
      // API endpoints
      {
        source: '/sitecore/api/:path*',
        destination: `${jssConfig.sitecoreApiHost}/sitecore/api/:path*`,
      },
      // media items
      {
        source: '/-/:path*',
        destination: `${jssConfig.sitecoreApiHost}/-/:path*`,
      },
      // healthz check
      {
        source: '/healthz',
        destination: '/api/healthz',
      },
      // rewrite for Sitecore service pages
      {
        source: '/sitecore/service/:path*',
        destination: `${jssConfig.sitecoreApiHost}/sitecore/service/:path*`,
      },
    ];
  },
  ...headerConfig,
};

module.exports = () => {  
  console.log('Asset Prefix:', nextConfig.assetPrefix); // This will log the value of assetPrefix
  console.log('Asset Prefix2:', process.env.NEXT_PUBLIC_XMC_DEFAULT_RH); // This will log the value of assetPrefix2
  // Run the base config through any configured plugins
  return Object.values(plugins).reduce((acc, plugin) => plugin(acc), nextConfig);
};
