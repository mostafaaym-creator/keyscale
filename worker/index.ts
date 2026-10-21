import catalogData from '../src/data/catalog.json';
import pricesData from '../src/data/prices.json';
import importAudit from '../src/data/import-audit.json';

interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
  DB?: any;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // API Routes
    if (url.pathname.startsWith('/api/')) {
      const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      };

      if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
      }

      // Health endpoint
      if (url.pathname === '/api/health') {
        return new Response(
          JSON.stringify({
            status: 'ok',
            app: 'keyscale',
            version: '1.0.0',
            environment: 'cloudflare-worker'
          }),
          { headers: corsHeaders }
        );
      }

      // Catalog statistics
      if (url.pathname === '/api/stats') {
        return new Response(JSON.stringify(importAudit), { headers: corsHeaders });
      }

      // Search & List keyboards
      if (url.pathname === '/api/keyboards') {
        const query = (url.searchParams.get('q') || '').toLowerCase();
        const brand = url.searchParams.get('brand') || '';
        const limit = parseInt(url.searchParams.get('limit') || '50', 10);

        let filtered = (catalogData as any[]).filter(k => {
          if (brand && k.brand.toLowerCase() !== brand.toLowerCase()) return false;
          if (query) {
            const str = `${k.brand} ${k.model} ${k.family || ''}`.toLowerCase();
            if (!str.includes(query)) return false;
          }
          return true;
        });

        return new Response(
          JSON.stringify({
            total: filtered.length,
            results: filtered.slice(0, limit)
          }),
          { headers: corsHeaders }
        );
      }

      // Single keyboard details
      if (url.pathname.startsWith('/api/keyboards/')) {
        const id = url.pathname.replace('/api/keyboards/', '');
        const item = (catalogData as any[]).find(k => k.id === id);

        if (!item) {
          return new Response(JSON.stringify({ error: 'Keyboard not found' }), {
            status: 404,
            headers: corsHeaders
          });
        }

        const prices = (pricesData as Record<string, any>)[id] || [];
        return new Response(
          JSON.stringify({
            keyboard: item,
            prices
          }),
          { headers: corsHeaders }
        );
      }

      // Brands list
      if (url.pathname === '/api/brands') {
        const brands = Array.from(new Set((catalogData as any[]).map(k => k.brand))).sort();
        return new Response(JSON.stringify({ brands }), { headers: corsHeaders });
      }

      return new Response(JSON.stringify({ error: 'Unknown API endpoint' }), {
        status: 404,
        headers: corsHeaders
      });
    }

    // Default: Fallback to Cloudflare Static Assets SPA
    return env.ASSETS.fetch(request);
  }
};
