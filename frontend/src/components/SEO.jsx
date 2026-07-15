import React from 'react';
import { Helmet } from 'react-helmet-async';

export function SEO({
  title,
  description,
  keywords = 'coding interviews, competitive programming, dsa, software engineering, coding problems, spaced repetition, tech interview prep',
  type = 'website',
  url = 'https://revoraa.com',
  image = 'https://revoraa.com/og-image.jpg',
  author = 'Revoraa Team',
  publishedTime,
  modifiedTime,
}) {
  const siteName = 'Revoraa';
  const fullTitle = title === siteName ? siteName : `${title} | ${siteName}`;
  const defaultDesc = 'Track, revise, and master coding interview problems with spaced repetition and AI analytics.';
  const finalDesc = description || defaultDesc;

  // JSON-LD structured data for Software Application & WebSite
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': type === 'article' ? 'Article' : 'WebSite',
    name: fullTitle,
    description: finalDesc,
    url: url,
    publisher: {
      '@type': 'Organization',
      name: siteName,
      logo: {
        '@type': 'ImageObject',
        url: 'https://revoraa.com/logo.png',
      },
    },
    ...(type === 'article' && {
      headline: title,
      image: [image],
      datePublished: publishedTime,
      dateModified: modifiedTime || publishedTime,
      author: {
        '@type': 'Person',
        name: author,
      },
    }),
  };

  // Generic Software Application JSON-LD
  const appJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Revoraa',
    operatingSystem: 'Any',
    applicationCategory: 'EducationalApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={finalDesc} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={finalDesc} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={finalDesc} />
      <meta name="twitter:image" content={image} />

      {/* Article Specific Metadata */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      <script type="application/ld+json">{JSON.stringify(appJsonLd)}</script>
    </Helmet>
  );
}
