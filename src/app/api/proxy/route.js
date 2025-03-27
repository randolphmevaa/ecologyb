// File: app/api/proxy/route.js

export async function GET( ) {
  const remoteUrl = 'https://dext.com/en';
  try {
    const response = await fetch(remoteUrl);
    if (!response.ok) {
      return new Response(null, { status: response.status });
    }
    
    const contentType = response.headers.get('content-type') || 'text/html';
    let data = await response.text();

    // Rewrite asset URLs that start with "/" so they use our asset proxy.
    // For example: src="/_next/static/..." becomes
    // src="/api/proxy/asset?url=https://dext.com/_next/static/..."
    data = data.replace(/(src|href)=["']\/(?!\/)/g, `$1="/api/proxy/asset?url=https://dext.com/`);

    // Inject a script to override history.replaceState to catch and ignore errors.
    data = data.replace(
      /<head([^>]*)>/,
      `<head$1>
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
      headers: {
        'Content-Type': contentType,
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
