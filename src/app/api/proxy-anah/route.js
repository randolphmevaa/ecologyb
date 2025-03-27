// File: app/api/proxy-anah/route.js

export async function GET( ) {
    const remoteUrl = 'https://www.anah.gouv.fr/';
    try {
      const response = await fetch(remoteUrl);
      if (!response.ok) {
        return new Response(null, { status: response.status });
      }
      
      const contentType = response.headers.get('content-type') || 'text/html';
      let data = await response.text();
  
      // Rewrite asset URLs: convert any src or href attribute that starts with "/"
      // so they are routed through our asset proxy endpoint.
      // For example, src="/images/logo.png" becomes:
      // src="/api/proxy-anah/asset?url=https://www.anah.gouv.fr/images/logo.png"
      data = data.replace(/(src|href)=["']\/(?!\/)/g, `$1="/api/proxy-anah/asset?url=https://www.anah.gouv.fr/`);
  
      // Inject a <base> tag and a history override script into the <head> section.
      // The <base> tag ensures that all relative URLs resolve against the remote domain.
      data = data.replace(
        /<head([^>]*)>/,
        `<head$1>
          <base href="https://www.anah.gouv.fr/">
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
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
  