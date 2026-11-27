// Vercel Web Analytics
// This script injects the Vercel Analytics tracking code
// Documentation: https://vercel.com/docs/analytics/quickstart

import { inject } from '@vercel/analytics';

inject({
  mode: 'auto', // Auto-detect production vs development
  debug: true   // Enable debug logging in development
});
