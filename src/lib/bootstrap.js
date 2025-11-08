// Parse context from WebView/host: userId, token, lang, etc.
export function parseBootstrapContext() {
  const url = new URL(window.location.href);
  const userId = url.searchParams.get('userId') || 'guest';
  const token = url.searchParams.get('token') || null;
  const lang = url.searchParams.get('lang') || 'zh-Hant';
  return { userId, token, lang };
}
