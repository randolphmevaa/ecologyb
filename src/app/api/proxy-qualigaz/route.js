// File: app/api/proxy-qualigaz/route.js

export async function GET( ) {
    const remoteUrl = 'https://www.qualigaz-evonia.com/';
    try {
      const response = await fetch(remoteUrl);
      if (!response.ok) {
        return new Response(null, { status: response.status });
      }
  
      const contentType = response.headers.get('content-type') || 'text/html';
      let data = await response.text();
  
      // Rewrite asset URLs: any src or href attributes that start with "/"
      // will be rewritten to use the asset proxy endpoint.
      // For example, src="/images/logo.png" becomes:
      // src="/api/proxy-qualigaz/asset?url=https://www.qualigaz-evonia.com/images/logo.png"
      data = data.replace(/(src|href)=["']\/(?!\/)/g, `$1="/api/proxy-qualigaz/asset?url=https://www.qualigaz-evonia.com/`);
  
      // Insert a <base> tag and a history override script in the <head> section.
      // The <base> tag ensures that all relative URLs are resolved against the remote domain.
      data = data.replace(
        /<head([^>]*)>/,
        `<head$1>
          <base href="https://www.qualigaz-evonia.com/">
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
  