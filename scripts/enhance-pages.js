const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '..');
const PAGES_DIR = path.join(SRC_DIR, 'pages');
const DIST_DIR = path.join(__dirname, '../dist');

const BASE_URL = 'https://purecleancheshire.co.uk';

// Page metadata
const pageData = {
  'index.html': {
    title: 'Pure Clean Cheshire | Deep Cleaning & End of Tenancy Specialists Cheshire',
    description: 'Bespoke Deep Cleaning Services in Frodsham, Cheshire. End of tenancy, deep cleans, Airbnb turnovers, and property cleaning. Fully insured, eco-friendly, 5-star rated.',
    canonical: '/',
    ogTitle: 'Pure Clean Cheshire | Deep Cleaning & End of Tenancy Specialists',
    ogDescription: 'Professional bespoke deep cleaning services in Frodsham, Cheshire. End of tenancy, Airbnb turnovers, one-off deep cleans. Fully insured, eco-friendly, 5-star rated.',
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'Pure Clean Cheshire',
      description: 'Professional bespoke deep cleaning services in Frodsham, Cheshire. End of tenancy, Airbnb turnovers, one-off deep cleans.',
      url: BASE_URL,
      telephone: '+44-1928-XXX-XXXX',
      email: 'hello@purecleancheshire.co.uk',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Frodsham',
        addressLocality: 'Frodsham',
        addressRegion: 'Cheshire',
        postalCode: 'WA6',
        addressCountry: 'GB'
      },
      areaServed: {
        '@type': 'GeoCircle',
        geoMidpoint: {
          '@type': 'GeoCoordinates',
          latitude: 53.294,
          longitude: -2.725
        },
        geoRadius: '15000'
      },
      priceRange: '££',
      openingHoursSpecification: [{
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '08:00',
        closes: '18:00'
      }],
      serviceType: ['Deep Cleaning', 'End of Tenancy Cleaning', 'Airbnb Turnover Cleaning', 'One-off Deep Cleaning', 'Carpet & Upholstery Cleaning', 'Oven & Appliance Cleaning'],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '127'
      },
      review: [
        {
          '@type': 'Review',
          author: { '@type': 'Person', name: 'Sarah Mitchell' },
          datePublished: '2024-11-15',
          reviewRating: { '@type': 'Rating', ratingValue: '5' },
          reviewBody: 'Absolutely outstanding end of tenancy clean. The team were thorough, professional, and the property passed inspection first time. Highly recommend for Frodsham area.'
        },
        {
          '@type': 'Review',
          author: { '@type': 'Person', name: 'James Thornton' },
          datePublished: '2024-10-22',
          reviewRating: { '@type': 'Rating', ratingValue: '5' },
          reviewBody: 'Used for Airbnb turnover cleaning. Reliable, consistent, and the photo proof after each clean gives total peace of mind when managing remotely.'
        }
      ]
    }
  },
  'services.html': {
    title: 'Our Services | Pure Clean Cheshire',
    description: 'Professional cleaning services in Frodsham, Cheshire. End of tenancy cleaning, deep cleaning, Airbnb turnovers, carpet & upholstery cleaning, oven cleaning. View detailed checklists and book online.',
    canonical: '/services.html',
    ogTitle: 'Our Cleaning Services | Pure Clean Cheshire',
    ogDescription: 'End of tenancy, deep cleaning, Airbnb turnovers, carpet & upholstery cleaning. Detailed checklists, fixed prices, 7-day guarantee.',
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: ['End of Tenancy Cleaning', 'Deep Cleaning', 'Airbnb Turnover Cleaning', 'Carpet Cleaning', 'Upholstery Cleaning', 'Oven Cleaning'],
      provider: {
        '@type': 'LocalBusiness',
        name: 'Pure Clean Cheshire',
        url: BASE_URL,
        telephone: '+44-1928-XXX-XXXX',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Frodsham',
          addressRegion: 'Cheshire',
          postalCode: 'WA6',
          addressCountry: 'GB'
        }
      },
      areaServed: 'Frodsham, Helsby, Elton, Ince, Runcorn, Warrington, Cheshire',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Cleaning Services',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'End of Tenancy Cleaning', description: 'Inventory-standard deep clean for deposit return' }, price: '150', priceCurrency: 'GBP' },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'One-Off Deep Cleaning', description: 'Comprehensive seasonal deep clean' }, price: '120', priceCurrency: 'GBP' },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Airbnb Turnover Cleaning', description: 'Same-day changeover for short-term lets' }, price: '80', priceCurrency: 'GBP' },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Carpet & Upholstery Cleaning', description: 'Hot-water extraction cleaning' }, price: '35', priceCurrency: 'GBP' },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Oven & Appliance Cleaning', description: 'Deep clean of oven, hob, extractor' }, price: '45', priceCurrency: 'GBP' }
        ]
      }
    }
  },
  'pricing.html': {
    title: 'Pricing | Pure Clean Cheshire',
    description: 'Transparent pricing for deep cleaning services in Frodsham, Cheshire. End of tenancy from £150, deep cleans from £120, Airbnb turnovers from £80. Fixed prices, no hidden fees.',
    canonical: '/pricing.html',
    ogTitle: 'Transparent Pricing | Pure Clean Cheshire',
    ogDescription: 'Fixed prices for end of tenancy, deep cleaning, Airbnb turnovers. No hourly rates, no hidden fees. Get a free quote in 2 minutes.',
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'PriceSpecification',
      name: 'Cleaning Service Pricing',
      description: 'Transparent fixed pricing for all cleaning services',
      priceCurrency: 'GBP',
      minPrice: '70',
      maxPrice: '350',
      validFrom: '2024-01-01',
      priceRange: '£70 - £350',
      serviceType: ['End of Tenancy Cleaning', 'Deep Cleaning', 'Airbnb Turnover', 'Regular Cleaning', 'Specialist Add-Ons']
    }
  },
  'about.html': {
    title: 'About Us | Pure Clean Cheshire',
    description: 'Pure Clean Cheshire - Professional deep cleaning specialists in Cheshire. Family-run, fully insured, DBS-checked team, eco-friendly products, 7-day guarantee.',
    canonical: '/about.html',
    ogTitle: 'About Pure Clean Cheshire | Our Story & Team',
    ogDescription: 'Family-run professional cleaning business in Frodsham, Cheshire. Founded 2019, 8 team members, fully insured, DBS checked, eco-friendly.',
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'Pure Clean Cheshire',
      description: 'Professional bespoke deep cleaning services in Frodsham, Cheshire. Family-run, fully insured, DBS-checked team.',
      url: BASE_URL,
      telephone: '+44-1928-XXX-XXXX',
      email: 'hello@purecleancheshire.co.uk',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Frodsham',
        addressLocality: 'Frodsham',
        addressRegion: 'Cheshire',
        postalCode: 'WA6',
        addressCountry: 'GB'
      },
      foundingDate: '2019',
      numberOfEmployees: '8',
      areaServed: ['Frodsham', 'Helsby', 'Elton', 'Ince', 'Runcorn', 'Warrington', 'Cheshire'],
      brand: 'Pure Clean Cheshire',
      currenciesAccepted: 'GBP',
      paymentAccepted: ['Cash', 'Credit Card', 'Bank Transfer', 'Contactless']
    }
  },
  'areas.html': {
    title: 'Areas We Cover | Pure Clean Cheshire',
    description: 'Pure Clean Cheshire service areas: Frodsham, Helsby, Elton, Ince, Runcorn, Warrington and surrounding Cheshire villages. Check if we cover your postcode.',
    canonical: '/areas.html',
    ogTitle: 'Areas We Cover | Pure Clean Cheshire',
    ogDescription: 'Serving Frodsham, Helsby, Elton, Ince, Runcorn, Warrington and surrounding Cheshire villages. 15-mile radius from Frodsham town centre.',
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'ServiceArea',
      name: 'Pure Clean Cheshire Service Areas',
      description: 'Professional cleaning services covering Frodsham and surrounding Cheshire areas',
      provider: {
        '@type': 'LocalBusiness',
        name: 'Pure Clean Cheshire',
        url: BASE_URL
      },
      areaServed: [
        { '@type': 'City', name: 'Frodsham', postalCode: 'WA6' },
        { '@type': 'City', name: 'Helsby', postalCode: 'WA6' },
        { '@type': 'City', name: 'Elton', postalCode: 'CH2' },
        { '@type': 'City', name: 'Ince', postalCode: 'CH2' },
        { '@type': 'City', name: 'Runcorn', postalCode: 'WA7' },
        { '@type': 'City', name: 'Warrington', postalCode: ['WA4', 'WA5'] }
      ],
      serviceType: ['Deep Cleaning', 'End of Tenancy Cleaning', 'Airbnb Turnover Cleaning', 'Regular Cleaning']
    }
  },
  'contact.html': {
    title: 'Get a Quote | Pure Clean Cheshire',
    description: 'Get a free quote for deep cleaning services in Frodsham, Cheshire. End of tenancy, Airbnb turnovers, one-off deep cleans. Simple form, fixed price within 2 hours.',
    canonical: '/contact.html',
    ogTitle: 'Get Your Free Cleaning Quote | Pure Clean Cheshire',
    ogDescription: 'Free, no-obligation quotes for end of tenancy, deep cleaning, Airbnb turnovers. Fixed price within 2 hours. No follow-up calls.',
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Get a Quote - Pure Clean Cheshire',
      description: 'Request a free quote for professional cleaning services',
      url: BASE_URL + '/contact.html',
      mainEntity: {
        '@type': 'LocalBusiness',
        name: 'Pure Clean Cheshire',
        url: BASE_URL,
        telephone: '+44-1928-XXX-XXXX',
        email: 'hello@purecleancheshire.co.uk',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Frodsham',
          addressLocality: 'Frodsham',
          addressRegion: 'Cheshire',
          postalCode: 'WA6',
          addressCountry: 'GB'
        },
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: '+44-1928-XXX-XXXX',
            contactType: 'customer service',
            availableLanguage: 'English',
            areaServed: 'GB',
            hoursAvailable: {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
              opens: '08:00',
              closes: '18:00'
            }
          },
          {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            availableLanguage: 'English',
            areaServed: 'GB',
            contactOption: 'HearingImpairedSupported',
            email: 'hello@purecleancheshire.co.uk'
          }
        ]
      }
    }
  }
};

// Process each page
async function enhancePages() {
  console.log('Enhancing pages with SEO meta tags...');
  
  for (const [filename, data] of Object.entries(pageData)) {
    let srcPath;
    if (filename === 'index.html') {
      srcPath = path.join(SRC_DIR, filename);
    } else {
      srcPath = path.join(PAGES_DIR, filename);
    }
    
    const destPath = path.join(DIST_DIR, filename);
    
    if (!fs.existsSync(srcPath)) {
      console.warn(`Source not found: ${srcPath}`);
      continue;
    }
    
    let html = fs.readFileSync(srcPath, 'utf8');
    
    // Add canonical URL
    const canonicalUrl = BASE_URL + data.canonical;
    const canonicalTag = `<link rel="canonical" href="${canonicalUrl}">`;
    
    // Add enhanced meta tags
    const enhancedMeta = `
    <meta name="description" content="${data.description}">
    <meta name="keywords" content="${getKeywords(filename)}">
    <meta name="author" content="Pure Clean Cheshire">
    <meta property="og:title" content="${data.ogTitle}">
    <meta property="og:description" content="${data.ogDescription}">
    <meta property="og:type" content="${data.ogType}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:image" content="${BASE_URL}/images/og-image.jpg">
    <meta property="og:site_name" content="Pure Clean Cheshire">
    <meta property="og:locale" content="en_GB">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${data.ogTitle}">
    <meta name="twitter:description" content="${data.ogDescription}">
    <meta name="twitter:image" content="${BASE_URL}/images/og-image.jpg">
    <meta name="theme-color" content="#2D2D2D">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${canonicalTag}`;
    
    // Replace existing meta tags with enhanced ones
    // First, remove existing meta description, keywords, og tags, twitter tags
    html = html.replace(/<meta name="description"[^>]*>/g, '');
    html = html.replace(/<meta name="keywords"[^>]*>/g, '');
    html = html.replace(/<meta name="author"[^>]*>/g, '');
    html = html.replace(/<meta property="og:[^"]*"[^>]*>/g, '');
    html = html.replace(/<meta name="twitter:[^"]*"[^>]*>/g, '');
    html = html.replace(/<meta name="theme-color"[^>]*>/g, '');
    html = html.replace(/<link rel="canonical"[^>]*>/g, '');
    
    // Insert enhanced meta after title
    html = html.replace(
      /(<title[^>]*>.*?<\/title>)/,
      '$1' + enhancedMeta
    );
    
    // Add JSON-LD if not present, or replace existing
    const jsonLdScript = `
    <script type="application/ld+json">
${JSON.stringify(data.jsonLd, null, 8)}
    </script>`;
    
    // Remove existing JSON-LD
    html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '');
    
    // Insert new JSON-LD before </head>
    html = html.replace('</head>', jsonLdScript + '\n</head>');
    
    // Update title
    html = html.replace(/<title>.*?<\/title>/, `<title>${data.title}</title>`);
    
    // Write enhanced file
    fs.writeFileSync(destPath, html);
    console.log(`Enhanced: ${filename}`);
  }
  
  console.log('Page enhancement complete!');
}

function getKeywords(filename) {
  const keywords = {
    'index.html': 'deep cleaning Frodsham, end of tenancy cleaning Cheshire, property cleaning Frodsham, Airbnb cleaning Cheshire, bespoke cleaning services Frodsham',
    'services.html': 'end of tenancy cleaning Frodsham, deep cleaning Cheshire, Airbnb cleaning Frodsham, carpet cleaning Cheshire, oven cleaning Frodsham',
    'pricing.html': 'cleaning prices Frodsham, end of tenancy cleaning cost Cheshire, deep cleaning prices Frodsham, Airbnb cleaning cost Cheshire',
    'about.html': 'about Pure Clean Cheshire, professional cleaners Cheshire, family cleaning business Frodsham, insured cleaners WA6',
    'areas.html': 'cleaning services Frodsham WA6, cleaners Helsby Cheshire, end of tenancy cleaning Elton, deep cleaning Ince, Airbnb cleaning Runcorn',
    'contact.html': 'cleaning quote Frodsham, book cleaning Cheshire, end of tenancy cleaning booking Frodsham, deep cleaning estimate Cheshire'
  };
  return keywords[filename] || '';
}

// Run enhancement
enhancePages().catch(console.error);