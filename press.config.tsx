import { defineMintlifyI18n, mintlifyPlugin, readMintlifyDocs } from "@fumapress/mintlify";
import { defineConfig } from "fumapress";
import { fumadocsMdx } from "fumapress/adapters/mdx";
import { flexsearchPlugin } from "fumapress/plugins/flexsearch";
import { openapiPlugin } from "fumapress/plugins/openapi";
import { robotsPlugin } from "fumapress/plugins/robots";
import { update } from "fumadocs-core/source";
import { defineDocs } from "fumadocs-mdx/macro";
import { createOpenAPI, type OpenAPIServer } from "fumadocs-openapi/server";
import { readdirSync } from "node:fs";
import path from "node:path";

const SITE_URL = "https://docs.langbot.dev";
const LOCALES = ["en", "zh", "ja"] as const;
const MINTLIFY_LOCALE = { en: "en", zh: "cn", ja: "jp" } as const;
const HREFLANG = { en: "en", zh: "zh-CN", ja: "ja" } as const;
const mintlifyDocs = readMintlifyDocs();
const translations = defineMintlifyI18n(mintlifyDocs, {
  localeMap: { en: "en", cn: "zh", jp: "ja" },
}).translations();
// Locale-only files must not inherit the English storage and create indexed
// pages in locales where no canonical source translation exists.
translations.config.fallbackLanguage = null;

function collectRouteLocales() {
  const routes = new Map<string, Set<string>>();
  function visit(directory: string, prefix: string, locale: string) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const relative = path.posix.join(prefix, entry.name);
      if (entry.isDirectory()) visit(path.join(directory, entry.name), relative, locale);
      else if (entry.isFile() && entry.name.endsWith(".mdx")) {
        let route = relative.slice(0, -4);
        if (route === "index") route = "";
        else if (route.endsWith("/index")) route = route.slice(0, -6);
        const available = routes.get(route) ?? new Set<string>();
        available.add(locale);
        routes.set(route, available);
      }
    }
  }
  for (const locale of LOCALES) visit(path.resolve(locale), "", locale);
  return routes;
}

const routeLocales = collectRouteLocales();

function localizedNavbar(lang: string | undefined) {
  const locale = LOCALES.includes(lang as (typeof LOCALES)[number]) ? lang as (typeof LOCALES)[number] : "en";
  const language = mintlifyDocs.navigation.languages?.find(
    (entry) => entry.language === MINTLIFY_LOCALE[locale],
  );
  const navbar = language?.navbar ?? mintlifyDocs.navbar;
  return [
    ...(navbar?.links ?? []).map((link) => ({ text: link.label ?? link.href, url: link.href })),
    ...(navbar?.primary ? [{
      type: "button" as const,
      text: navbar.primary.label ?? navbar.primary.href,
      url: navbar.primary.href,
    }] : []),
  ];
}
const enOpenAPI = createOpenAPI({ input: ["openapi/service-api-en.json"] });
const zhOpenAPI = createOpenAPI({ input: ["openapi/service-api-zh.json"] });
const jaOpenAPI = createOpenAPI({ input: ["openapi/service-api-ja.json"] });

function localizeOpenAPISource(
  source: Awaited<ReturnType<OpenAPIServer["staticSource"]>>,
  locale: string,
) {
  return update(source)
    .page((page) => ({
      ...page,
      // Fumadocs' dot parser owns the URL locale prefix. Mark each virtual
      // file with its locale and remove the same prefix from its route slugs.
      path: page.path
        .slice(`${locale}/`.length)
        .replace(/\.mdx$/, `.${locale}.mdx`),
    }))
    .build();
}

const docs = defineDocs({
  dir: "content/docs",
  docs: {
    async: true,
    postprocess: { includeProcessedMarkdown: true },
  },
});

export default defineConfig({
  mode: "static",
  site: {
    baseUrl: SITE_URL,
    name: "LangBot Docs",
  },
  content: {
    docs: docs.toFumadocsSource(),
    openapiEn: localizeOpenAPISource(
      await enOpenAPI.staticSource({ baseDir: "en/api-reference" }),
      "en",
    ),
    openapiZh: localizeOpenAPISource(
      await zhOpenAPI.staticSource({ baseDir: "zh/api-reference" }),
      "zh",
    ),
    openapiJa: localizeOpenAPISource(
      await jaOpenAPI.staticSource({ baseDir: "ja/api-reference" }),
      "ja",
    ),
  },
  translations,
  defaultLayoutProps: ({ lang }) => ({
    links: localizedNavbar(lang),
  }),
  meta: {
    page: (page) => {
      const locale = page.locale as (typeof LOCALES)[number];
      const route = page.slugs.join("/");
      const available = route.startsWith("api-reference/")
        ? new Set<string>(LOCALES)
        : routeLocales.get(route) ?? new Set<string>([locale]);
      const alternates = LOCALES.filter((candidate) => available.has(candidate));
      const defaultLocale = alternates.includes("en") ? "en" : alternates[0];
      return <>
        <link rel="canonical" href={`${SITE_URL}${page.url}`} />
        {alternates.map((candidate) => (
          <link
            key={candidate}
            rel="alternate"
            hrefLang={HREFLANG[candidate]}
            href={`${SITE_URL}/${candidate}/${route}`.replace(/\/$/, "")}
          />
        ))}
        {defaultLocale && (
          <link
            rel="alternate"
            hrefLang="x-default"
            href={`${SITE_URL}/${defaultLocale}/${route}`.replace(/\/$/, "")}
          />
        )}
      </>;
    },
  },
})
  .adapters(fumadocsMdx())
  // One registration is intentional: its adapter and loader plugin handle all
  // OpenAPI virtual pages, regardless of which content source generated them.
  .plugins(
    flexsearchPlugin({
      async buildIndex(page) {
        const title = page.data.title ?? page.path;
        const description = page.data.description;
        const sourceStructuredData = typeof page.data.structuredData === "function"
          ? await page.data.structuredData()
          : page.data.structuredData;
        // FlexSearch's static serialization expands multilingual documents
        // considerably. Index titles, descriptions, a few headings, and the
        // opening content so search remains useful without exceeding Pages'
        // hard 25 MiB per-file limit. OpenAPI endpoints intentionally omit the
        // schema body, which is duplicated across every generated operation.
        const isOpenAPI = page.url.includes("/api-reference/");
        const headings = isOpenAPI
          ? []
          : sourceStructuredData.headings.slice(0, 4).map((heading) => ({
              ...heading,
              content: heading.content.slice(0, 100),
            }));
        const openingContent = isOpenAPI
          ? []
          : sourceStructuredData.contents.slice(0, 2).map((content) => content.content.slice(0, 300));
        const structuredData = {
          headings,
          contents: [{
            heading: undefined,
            content: [title, description, ...openingContent, page.url].filter(Boolean).join(" "),
          }],
        };
        return { id: page.url, title, description, url: page.url, structuredData };
      },
    }),
    mintlifyPlugin({ features: { navbar: false } }),
    openapiPlugin({ server: enOpenAPI }),
    robotsPlugin({
      rules: [{ userAgent: "*", allow: ["/", "/_next/"] }],
      sitemap: true,
      additionalContent: "Sitemap: https://docs.langbot.dev/sitemap-alternates.xml",
    }),
  );
