// File: app/api/proxy-effy/route.js

export async function GET( ) {
    const remoteUrl = 'https://www.effy.fr/pro';
    try {
      const response = await fetch(remoteUrl);
      if (!response.ok) {
        return new Response(null, { status: response.status });
      }
      const contentType = response.headers.get('content-type') || 'text/html';
      let data = await response.text();
  
      // Rewrite asset URLs so that relative URLs (starting with "/")
      // are replaced to point to our asset proxy endpoint.
      // For example: src="/assets/..." becomes:
      // src="/api/proxy-effy/asset?url=https://www.effy.fr/assets/..."
      data = data.replace(/(src|href)=["']\/(?!\/)/g, `$1="/api/proxy-effy/asset?url=https://www.effy.fr/`);
  
      // Insert a <base> tag and a history override script in the <head> section.
      data = data.replace(
        /<head([^>]*)>/,
        `<head$1>
          <base href="https://www.effy.fr/pro/">
          <script>
            (function() {
              const originalReplaceState = history.replaceState;
              history.replaceState = function(state, title, url) {
                try {
                  return originalReplaceState.call(history, state, title, url);
                } catch (e) {
                  console.warn("history.replaceState blocked:", e);
                }
              };
            })();
          </script>`
      );
  
      return new Response(data, {
        status: 200,
        headers: { 'Content-Type': contentType },
      });
    } catch (error) {
      console.error('Proxy error:', error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
  