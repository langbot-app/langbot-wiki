import { defineMintlifyI18n, mintlifyPlugin, readMintlifyDocs } from "@fumapress/mintlify";
import { defineConfig } from "fumapress";
import type { Folder, Node as PageTreeNode, Root, Separator } from "fumadocs-core/page-tree";
import { fumadocsMdx } from "fumapress/adapters/mdx";
import { flexsearchPlugin } from "fumapress/plugins/flexsearch";
import { openapiPlugin } from "fumapress/plugins/openapi";
import { robotsPlugin } from "fumapress/plugins/robots";
import { update } from "fumadocs-core/source";
import { uiTranslations } from "fumadocs-ui/i18n";
import { defineDocs } from "fumadocs-mdx/macro";
import { createOpenAPI, type OpenAPIServer } from "fumadocs-openapi/server";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const SITE_URL = "https://docs.langbot.dev";
const LOCALES = ["en", "zh", "ja"] as const;
const MINTLIFY_LOCALE = { en: "en", zh: "cn", ja: "jp" } as const;
const HREFLANG = { en: "en", zh: "zh-CN", ja: "ja" } as const;
const mintlifyDocs = readMintlifyDocs();

function nodeName(node: PageTreeNode) {
  return typeof node.name === "string" ? node.name : "";
}

const openApiTagOrder = Object.fromEntries(LOCALES.map((locale) => {
  const spec = JSON.parse(readFileSync(`openapi/service-api-${locale}.json`, "utf8"));
  const tags: string[] = [];
  for (const pathItem of Object.values(spec.paths ?? {}) as Record<string, any>[]) {
    for (const operation of Object.values(pathItem)) {
      if (!operation || typeof operation !== "object") continue;
      for (const tag of operation.tags ?? []) if (!tags.includes(tag)) tags.push(tag);
    }
  }
  return [locale, tags];
})) as Record<(typeof LOCALES)[number], string[]>;

function generatedOpenApiGroups(tree: Root, locale: (typeof LOCALES)[number]) {
  const apiRoot = tree.children.find(
    (node) => node.type === "folder" && node.$ref?.folder === "api-reference",
  );
  if (!apiRoot || apiRoot.type !== "folder") return [];
  const order = openApiTagOrder[locale];
  const rank = (name: string) => order.findIndex((tag) => tag.toLocaleLowerCase() === name.toLocaleLowerCase());
  return [...apiRoot.children]
    .sort((left, right) => {
      const leftIndex = rank(nodeName(left));
      const rightIndex = rank(nodeName(right));
      return (leftIndex < 0 ? Number.MAX_SAFE_INTEGER : leftIndex)
        - (rightIndex < 0 ? Number.MAX_SAFE_INTEGER : rightIndex);
    })
    .map((node) => {
      const index = rank(nodeName(node));
      return index >= 0 ? { ...node, name: order[index] } : node;
    });
}

function sectionizeMintlifyTree(
  tree: Root,
  sourceTree: Root,
  locale: (typeof LOCALES)[number],
): Root {
  const language = mintlifyDocs.navigation.languages?.find(
    (entry) => entry.language === MINTLIFY_LOCALE[locale],
  );
  const generatedApiGroups = generatedOpenApiGroups(sourceTree, locale);
  return {
    ...tree,
    children: tree.children.map((node): PageTreeNode => {
      if (node.type !== "folder") return node;
      const configuredTab = language?.tabs?.find((tab) => tab.tab === nodeName(node));
      const sourceGroups = new Map(
        node.children
          .filter((child): child is Folder => child.type === "folder")
          .map((child) => [nodeName(child), child]),
      );
      const children: PageTreeNode[] = [];
      for (const group of configuredTab?.groups ?? []) {
        if (group.hidden) continue;
        const separator: Separator = {
          $id: `${node.$id}:${group.group}:section`,
          type: "separator",
          name: group.group,
        };
        children.push(separator);
        if ("openapi" in group && group.openapi) {
          children.push(...generatedApiGroups);
          continue;
        }
        const sourceGroup = sourceGroups.get(group.group);
        if (!sourceGroup) continue;
        if (sourceGroup.index) children.push(sourceGroup.index);
        children.push(...sourceGroup.children);
      }
      const tab: Folder = { ...node, root: true, children };
      return tab;
    }),
  };
}

const i18n = defineMintlifyI18n(mintlifyDocs, {
  localeMap: { en: "en", cn: "zh", jp: "ja" },
});
const translations = i18n.translations()
  .extend(uiTranslations())
  .add({
    en: { displayName: "English" },
    zh: { displayName: "简体中文" },
    ja: { displayName: "日本語" },
  });
// Fumapress stores translations.config as its runtime i18n config. Preserve
// the Mintlify adapter's locale bridge there so navigation.languages selects
// the matching English, Chinese, or Japanese tree instead of always using en.
Object.assign(translations.config, {
  _getMintlifyLanguage: (i18n as typeof i18n & {
    _getMintlifyLanguage?: (locale: string) => string | undefined;
  })._getMintlifyLanguage,
});
// Locale-only files must not inherit the English storage and create indexed
// pages in locales where no canonical source translation exists.
i18n.fallbackLanguage = null;
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

function legacyOpenApiSlug(value: string) {
  return value.replace(/\s+/g, "-").toLowerCase();
}

const legacyOpenApiLayout = {
  groupBy: "tag" as const,
  name: (entry: { info: { title: string } }) => legacyOpenApiSlug(entry.info.title),
};

function encodeRoute(route: string) {
  return route.split("/").map((segment) => encodeURIComponent(segment)).join("/");
}

const openApiAlternates = new Map<string, Partial<Record<(typeof LOCALES)[number], string>>>();
for (const locale of LOCALES) {
  const spec = JSON.parse(readFileSync(`openapi/service-api-${locale}.json`, "utf8"));
  for (const [apiPath, pathItem] of Object.entries(spec.paths ?? {}) as [string, Record<string, any>][]) {
    for (const [method, operation] of Object.entries(pathItem)) {
      if (!/^(?:get|post|put|patch|delete|head|options)$/i.test(method) || !operation?.summary) continue;
      const tag = operation.tags?.[0] ?? "unknown";
      const route = encodeRoute(`api-reference/${legacyOpenApiSlug(tag)}/${legacyOpenApiSlug(operation.summary)}`);
      const key = `${method.toLowerCase()} ${apiPath}`;
      const alternates = openApiAlternates.get(key) ?? {};
      alternates[locale] = route;
      openApiAlternates.set(key, alternates);
    }
  }
}
const openApiAlternatesByRoute = new Map<string, Partial<Record<(typeof LOCALES)[number], string>>>();
for (const alternates of openApiAlternates.values()) {
  for (const locale of LOCALES) {
    const route = alternates[locale];
    if (route) openApiAlternatesByRoute.set(`${locale}:${route}`, alternates);
  }
}

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
      await enOpenAPI.staticSource({ baseDir: "en/api-reference", ...legacyOpenApiLayout }),
      "en",
    ),
    openapiZh: localizeOpenAPISource(
      await zhOpenAPI.staticSource({ baseDir: "zh/api-reference", ...legacyOpenApiLayout }),
      "zh",
    ),
    openapiJa: localizeOpenAPISource(
      await jaOpenAPI.staticSource({ baseDir: "ja/api-reference", ...legacyOpenApiLayout }),
      "ja",
    ),
  },
  i18n,
  translations,
  defaultLayoutProps: ({ lang }) => ({
    links: localizedNavbar(lang),
  }),
  meta: {
    page: (page) => {
      const locale = page.locale as (typeof LOCALES)[number];
      const route = page.slugs.join("/");
      const localizedRoutes = route.startsWith("api-reference/")
        ? openApiAlternatesByRoute.get(`${locale}:${route}`) ?? { [locale]: route }
        : Object.fromEntries([...routeLocales.get(route) ?? new Set<string>([locale])].map((candidate) => [candidate, route]));
      const alternates = LOCALES.filter((candidate) => localizedRoutes[candidate]);
      const defaultLocale = alternates.includes("en") ? "en" : alternates[0];
      return <>
        <link rel="canonical" href={`${SITE_URL}${page.url}`} />
        {alternates.map((candidate) => (
          <link
            key={candidate}
            rel="alternate"
            hrefLang={HREFLANG[candidate]}
            href={`${SITE_URL}/${candidate}/${localizedRoutes[candidate]}`.replace(/\/$/, "")}
          />
        ))}
        {defaultLocale && (
          <link
            rel="alternate"
            hrefLang="x-default"
            href={`${SITE_URL}/${defaultLocale}/${localizedRoutes[defaultLocale]}`.replace(/\/$/, "")}
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
    mintlifyPlugin({ path: "content/fumapress-docs.json", features: { navbar: false } }),
    {
      name: "langbot:sectioned-navigation",
      enforce: "post",
      init() {
        const context = this;
        const sourceTrees = new Map<string, Root>();
        for (const key of ["core:docs-layout", "core:notebook-layout"] as const) {
          const data = (this.data[key] ??= {});
          (data.transformers ??= []).push(async ({ data: props, page }) => {
            const locale = page.locale as (typeof LOCALES)[number];
            let sourceTree = sourceTrees.get(locale);
            if (!sourceTree) {
              sourceTree = (await context.getLoader()).getPageTree(page.locale);
              sourceTrees.set(locale, sourceTree);
            }
            props.layoutProps.tree = sectionizeMintlifyTree(props.layoutProps.tree, sourceTree, locale);
            return props;
          });
        }
      },
    },
    openapiPlugin({ server: enOpenAPI }),
    robotsPlugin({
      rules: [{ userAgent: "*", allow: ["/", "/_next/"] }],
      sitemap: true,
      additionalContent: "Sitemap: https://docs.langbot.dev/sitemap-alternates.xml",
    }),
  );
