/** Découverte d'URLs via sitemap.xml (gère les index de sitemaps). */

function decodeEntities(s) {
  return s
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'");
}

export async function fetchSitemapUrls(sitemapUrl, timeout = 30000, depth = 0) {
  const res = await fetch(sitemapUrl, {
    signal: AbortSignal.timeout(timeout),
    headers: { 'user-agent': 'rgaa-ci (audit accessibilité)' },
    redirect: 'follow'
  });
  if (!res.ok) throw new Error(`sitemap ${sitemapUrl} : HTTP ${res.status}`);
  const xml = await res.text();

  const locs = [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)]
    .map((m) => decodeEntities(m[1].trim()));

  // Index de sitemaps : on descend d'un niveau dans chaque sous-sitemap
  if (/<sitemapindex[\s>]/i.test(xml) && depth < 2) {
    const urls = [];
    for (const loc of locs) {
      try {
        urls.push(...(await fetchSitemapUrls(loc, timeout, depth + 1)));
      } catch (e) {
        console.error(`  ⚠ Sous-sitemap ignoré (${loc}) : ${e.message}`);
      }
    }
    return urls;
  }
  return locs;
}
