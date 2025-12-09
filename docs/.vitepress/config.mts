import { defineConfig } from "vitepress";
import { useSidebar } from "vitepress-openapi";
import specZh from '../assets/service-api-openapi-zh.json' with { type: 'json' }
import specEn from '../assets/service-api-openapi-en.json' with { type: 'json' }

const sidebarZh = useSidebar({
  spec: specZh,
  linkPrefix: '/zh/tags/',
})

const sidebarEn = useSidebar({
  spec: specEn,
  linkPrefix: '/en/tags/',
})

// https://vitepress.dev/reference/site-config
export default defineConfig({
  themeConfig: {
    logo: "/langbot-logo-0.5x.png",

    // 编辑链接
    editLink: {
      pattern:
        "https://github.com/langbot-app/Langbot-Wiki/edit/main/docs/:path",
    },

    // 本地搜索
    search: {
      provider: "local",
    },
  },

  sitemap: {
    hostname: 'https://docs.langbot.app',
    
  },

  locales: {
    root: {
      title: "LangBot 文档",
      label: "简体中文",
      lang: "zh",
      link: "/zh/",
      themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
          { text: "主页", link: "https://langbot.app" },
          { text: "市场", link: "https://space.langbot.app"},
          { text: "路线图", link: "https://langbot.featurebase.app/roadmap" },
        ],

        sidebar: [
          {
            text: "概述",
            items: [
              { text: "新手指引（必看）", link: "/zh/insight/guide" },
              { text: "社区资源", link: "/zh/insight/community" },
              { text: "特性规格", link: "/zh/insight/features" },
            ],
          },
          {
            text: "部署和使用",
            items: [
              {
                text: "部署 LangBot",
                collapsed: true,
                items: [
                  { text: "包管理器部署", link: "/zh/deploy/langbot/package" },
                  { text: "Docker部署", link: "/zh/deploy/langbot/docker" },
                  {
                    text: "1Panel面板部署",
                    link: "/zh/deploy/langbot/one-click/1panel",
                  },
                  {
                    text: "宝塔面板部署",
                    link: "/zh/deploy/langbot/one-click/bt",
                  },
                  { text: "手动部署", link: "/zh/deploy/langbot/manual" },
                ],
              },
              {
                text: "配置机器人",
                collapsed: true,
                link: "/zh/deploy/platforms/readme",
                items: [
                  {
                    text: "OneBot v11",
                    collapsed: true,
                    items: [
                      {
                        text: "NapCat",
                        link: "/zh/deploy/platforms/qq/aiocqhttp/napcat",
                      },
                      {
                        text: "Lagrange",
                        link: "/zh/deploy/platforms/qq/aiocqhttp/lagrange",
                      },
                      {
                        text: "llonebot",
                        link: "/zh/deploy/platforms/qq/aiocqhttp/llonebot",
                      },
                    ],
                  },
                  {
                    text: "QQ 官方机器人",
                    // link: "/deploy/platforms/qq/official",
                    collapsed: true,
                    items: [
                      {
                        text: "Webhook 方式",
                        link: "/zh/deploy/platforms/qq/official_webhook",
                      },
                      {
                        text: "WebSocket 方式",
                        link: "/zh/deploy/platforms/qq/official",
                      },
                    ],
                  },
                  {
                    text: "企业微信",
                    collapsed: true,
                    items: [
                      {
                        text: "内部应用",
                        link: "/zh/deploy/platforms/wecom/wecom",
                      },
                      {
                        text: "对外客服",
                        link: "/zh/deploy/platforms/wecom/wecomcs",
                      },
                      {
                        text: "智能机器人",
                        link: "/zh/deploy/platforms/wecom/wecombot",
                      }
                    ],
                  },
                  {
                    text: "微信",
                    collapsed: true,
                    items: [
                      {
                        text: "WeChatPadPro",
                        link: "/zh/deploy/platforms/wechat/wechatpad.md"
                      },
                    ],
                  },
                  { text: "微信公众号", link: "/zh/deploy/platforms/wxoa.md" },
                  { text: "飞书", link: "/zh/deploy/platforms/lark" },
                  { text: "钉钉", link: "/zh/deploy/platforms/dingtalk.md" },
                  { text: "Discord", link: "/zh/deploy/platforms/discord" },
                  { text: "Telegram", link: "/zh/deploy/platforms/telegram" },
                  { text: "Slack", link: "/zh/deploy/platforms/slack" },
                  { text: "LINE", link: "/zh/deploy/platforms/line" },
                  { text: "KOOK", link: "/zh/deploy/platforms/kook" },
                ],
              },
              {
                text: "配置模型",
                link: "/zh/deploy/models/readme",
              },
              {
                text: "修改对话流水线",
                link: "/zh/deploy/pipelines/readme",
                collapsed: true,
                items: [
                  { text: "Dify", link: "/zh/deploy/pipelines/dify" },
                  { text: "n8n", link: "/zh/deploy/pipelines/n8n" },
                  { text: "Langflow", link: "/zh/deploy/pipelines/langflow" },
                  { text: "TBox", link: "/zh/deploy/pipelines/tbox" },
                  { text: "Coze", link: "/zh/deploy/pipelines/coze" },
                ],
              },
              {
                text: "使用知识库",
                link: "/zh/deploy/knowledge/readme",
              },
              {
                text: "使用 MCP 服务",
                link: "zh/deploy/mcp/readme"
              },
              {
                text: "系统环境设置",
                link: "/zh/deploy/settings",
              },
              {
                text: "对话命令",
                link: "/zh/deploy/command",
              },
              {
                text: "更新 LangBot",
                link: "/zh/deploy/update",
              },
            ],
          },
          {
            text: "插件",
            // collapsed: true,
            items: [
              { text: "插件介绍", link: "/zh/plugin/plugin-intro" },
              {
                text: "插件开发",
                collapsed: true,
                items: [
                  { text: "基础教程", link: "/zh/plugin/dev/tutor" },
                  { text: "完善配置信息", link: "/zh/plugin/dev/basic-info" },
                  { text: "目录规范", link: "/zh/plugin/dev/directory-structure" },
                  {
                    text: "组件开发",
                    collapsed: true,
                    items: [
                      { text: "添加组件", link: "/zh/plugin/dev/components/add" },
                      { text: "组件：事件监听器", link: "/zh/plugin/dev/components/event-listener" },
                      { text: "组件：命令", link: "/zh/plugin/dev/components/command" },
                      { text: "组件：工具", link: "/zh/plugin/dev/components/tool" },
                      { text: "组件：知识检索器", link: "/zh/plugin/dev/components/knowledge-retriever" },
                    ],
                  },
                  {
                    text: "API 参考",
                    collapsed: true,
                    items: [
                      { text: "插件通用 API", link: "/zh/plugin/dev/apis/common" },
                      { text: "流水线事件", link: "/zh/plugin/dev/apis/pipeline-events" },
                      { text: "消息平台实体", link: "/zh/plugin/dev/apis/messages" },
                    ],
                  },
                  { text: "迁移指南", link: "/zh/plugin/dev/migration" },
                  {
                    text: "分发插件", collapsed: true,
                    items: [
                      { text: "发布到插件市场", link: "/zh/plugin/dev/publish/market" },
                      { text: "通过 GitHub 分发", link: "/zh/plugin/dev/publish/github" },
                    ]
                  },
                ],
              },
              { text: "系统兼容处理", link: "/zh/plugin/compatibility" },
            ],
          },
          {
            text: "实践",
            items: [
              {
                text: "将 LangBot 用于生产环境",
                collapsed: true,
                items: [
                  { text: "配置 HTTP 反向代理或通过网关访问 LangBot", link: "/zh/workshop/production/proxy-and-ssl" },
                ]
              },
              {
                text: "如何实现一个消息平台适配器？",
                link: "/zh/workshop/impl-platform-adapter",
              },
              {
                text: "容器网络配置详解",
                link: "/zh/workshop/network-details",
              },
              {
                text: "使用 New API 中转多种渠道模型",
                link: "/zh/workshop/newapi-integration"
              },
              {
                text: "接入来自胜算云的模型",
                link: "/zh/workshop/shengsuanyun-integration"
              },
              {
                text: "接入来自小马算力的模型",
                link: "/zh/workshop/tokenpony-integration"
              },
              {
                text: "接入 PPIO API 的模型",
                link: "/zh/workshop/ppio-integration"
              },
              {
                text: "接入 302.AI 的模型",
                link: "/zh/workshop/302ai-integration"
              }
            ],
          },
          {
            text: "[Beta] Service API 参考",
            items: [
              { text: "概述", link: "/zh/tags/readme" },
              { text: "Webhooks", link: "/zh/tags/webhook" },
              ...sidebarZh.generateSidebarGroups({
                linkPrefix: '/zh/tags/',
              }).map(group => ({
                ...group,
                collapsed: true, // Collapsible and open by default.
              })),
            ],
          },
          {
            text: "开发",
            items: [
              { text: "开发配置", link: "/zh/develop/dev-config" },
              { text: "组件架构", link: "/zh/develop/comp-arch" },
              { text: "插件运行时", link: "/zh/develop/plugin-runtime" },
              {
                text: "适配器开发",
                collapsed: true,
                items: [
                  {
                    text: "Discord 适配器",
                    collapsed: true,
                    items: [
                      { text: "概述", link: "/zh/develop/adapter/discord/README" },
                      { text: "快速开始", link: "/zh/develop/adapter/discord/quick_start" },
                      { text: "架构设计", link: "/zh/develop/adapter/discord/design" },
                      { text: "API 参考", link: "/zh/develop/adapter/discord/api_reference" },
                      { text: "故障排除", link: "/zh/develop/adapter/discord/troubleshooting" },
                    ],
                  },
                ],
              },
            ],
          },
        ],

        // 编辑链接
        editLink: {
          pattern:
            "https://github.com/langbot-app/Langbot-Wiki/edit/main/docs/:path",
        },

        // 导航栏的社交图标
        socialLinks: [
          {
            icon: "github",
            link: "https://github.com/langbot-app/LangBot",
          },
        ],
      },
    },
    en: {
      title: "LangBot Docs",
      label: "English",
      lang: "en",
      link: "/en/",
      themeConfig: {
        // https://vitepress.dev/reference/default-theme-config

        nav: [
          { text: "Home", link: "https://langbot.app" },
          { text: "Market", link: "https://space.langbot.app" },
          { text: "Roadmap", link: "https://langbot.featurebase.app/roadmap" },
        ],

        sidebar: [
          {
            text: "Overview",
            items: [
              { text: "Getting Started (Must Read)", link: "/en/insight/guide" },
              { text: "Community Resources", link: "/en/insight/community" },
              { text: "Features", link: "/en/insight/features" },
            ],
          },
          {
            text: "Deployment and Usage",
            items: [
              {
                text: "Deploy LangBot",
                collapsed: true,
                items: [
                  { text: "Package Manager Deployment", link: "/en/deploy/langbot/package" },
                  { text: "Docker Deployment", link: "/en/deploy/langbot/docker" },
                  {
                    text: "1Panel Deployment",
                    link: "/en/deploy/langbot/one-click/1panel",
                  },
                  {
                    text: "aaPanel Deployment",
                    link: "/en/deploy/langbot/one-click/bt",
                  },
                  { text: "Manual Deployment", link: "/en/deploy/langbot/manual" },
                ],
              },
              {
                text: "Configure Bots",
                collapsed: true,
                link: "/en/deploy/platforms/readme",
                items: [
                  { text: "Discord", link: "/en/deploy/platforms/discord" },
                  { text: "Telegram", link: "/en/deploy/platforms/telegram" },
                  { text: "Slack", link: "/en/deploy/platforms/slack" },
                  { text: "LINE", link: "/en/deploy/platforms/line" },
                  { text: "KOOK", link: "/en/deploy/platforms/kook" },
                  { text: "Lark", link: "/en/deploy/platforms/lark" },
                  { text: "DingTalk", link: "/en/deploy/platforms/dingtalk" },
                  {
                    text: "OneBot v11",
                    collapsed: true,
                    items: [
                      {
                        text: "NapCat",
                        link: "/en/deploy/platforms/qq/aiocqhttp/napcat",
                      },
                      {
                        text: "Lagrange",
                        link: "/en/deploy/platforms/qq/aiocqhttp/lagrange",
                      },
                      {
                        text: "llonebot",
                        link: "/en/deploy/platforms/qq/aiocqhttp/llonebot",
                      },
                    ],
                  },
                  {
                    text: "QQ Official Bot",
                    collapsed: true,
                    items: [
                      {
                        text: "Webhook Method",
                        link: "/en/deploy/platforms/qq/official_webhook",
                      },
                      {
                        text: "WebSocket Method",
                        link: "/en/deploy/platforms/qq/official",
                      },
                    ],
                  },
                  {
                    text: "WeCom (Enterprise WeChat)",
                    collapsed: true,
                    items: [
                      {
                        text: "Internal Application",
                        link: "/en/deploy/platforms/wecom/wecom",
                      },
                      {
                        text: "External Customer Service",
                        link: "/en/deploy/platforms/wecom/wecomcs",
                      },
                      {
                        text: "Intelligent Bot",
                        link: "/en/deploy/platforms/wecom/wecombot",
                      }
                    ],
                  },
                  { text: "WeChat Official Account", link: "/en/deploy/platforms/wxoa" },
                ],
              },
              {
                text: "Configure Models",
                link: "/en/deploy/models/readme",
              },
              {
                text: "Modify Dialogue Pipeline",
                link: "/en/deploy/pipelines/readme",
                collapsed: true,
                items: [
                  { text: "Dify", link: "/en/deploy/pipelines/dify" },
                  { text: "n8n", link: "/en/deploy/pipelines/n8n" },
                  { text: "Langflow", link: "/en/deploy/pipelines/langflow" },
                ],
              },
              {
                text: "Using Knowledge Base",
                link: "/en/deploy/knowledge/readme",
              },
              {
                text: "Using MCP Services",
                link: "/en/deploy/mcp/readme",
              },
              {
                text: "System Settings",
                link: "/en/deploy/settings",
              },
              {
                text: "Dialogue Commands",
                link: "/en/deploy/command",
              },
              {
                text: "Update LangBot",
                link: "/en/deploy/update",
              },
            ],
          },
          {
            text: "Plugins",
            items: [
              { text: "Plugin Introduction", link: "/en/plugin/plugin-intro" },
              {
                text: "Plugin Development",
                collapsed: true,
                items: [
                  { text: "Basic Tutorial", link: "/en/plugin/dev/tutor" },
                  { text: "Complete Plugin Configuration Information", link: "/en/plugin/dev/basic-info" },
                  { text: "Directory Structure", link: "/en/plugin/dev/directory-structure" },
                  {
                    text: "Component Development",
                    collapsed: true,
                    items: [
                      { text: "Adding Components", link: "/en/plugin/dev/components/add" },
                      { text: "Component: Event Listener", link: "/en/plugin/dev/components/event-listener" },
                      { text: "Component: Command", link: "/en/plugin/dev/components/command" },
                      { text: "Component: Tool", link: "/en/plugin/dev/components/tool" },
                      { text: "Component: Knowledge Retriever", link: "/en/plugin/dev/components/knowledge-retriever" },
                    ],
                  },
                  {
                    text: "API Reference",
                    collapsed: true,
                    items: [
                      { text: "Plugin Common APIs", link: "/en/plugin/dev/apis/common" },
                      { text: "Pipeline Events", link: "/en/plugin/dev/apis/pipeline-events" },
                      { text: "Message Platform Entities", link: "/en/plugin/dev/apis/messages" },
                    ],
                  },
                  { text: "Migration Guide", link: "/en/plugin/dev/migration" },
                  {
                    text: "Distribute Plugin", collapsed: true,
                    items: [
                      { text: "Publish to Marketplace", link: "/en/plugin/dev/publish/market" },
                      { text: "Distribute via GitHub", link: "/en/plugin/dev/publish/github" },
                    ]
                  },
                ],
              },
              { text: "System Compatibility", link: "/en/plugin/compatibility" },
            ],
          },
          {
            text: "Workshops",
            items: [
              {
                text: "Using LangBot in Production Environment",
                collapsed: true,
                items: [
                  { text: "Configuring HTTP Reverse Proxy or Accessing LangBot via Gateway", link: "/en/workshop/production/proxy-and-ssl" },
                ],
              },
              {
                text: "How to Implement a Message Platform Adapter?",
                link: "/en/workshop/impl-platform-adapter",
              },
              // {
              //  text: "Integrating Complete MCP Ecosystem in LangBot",
              // link: "/en/workshop/mcp-details"
              // },
              {
                text: "Container Network Configuration Details",
                link: "/en/workshop/network-details",
              },
              {
                text: "Using New API to Transmit Models from Multiple Channels",
                link: "/en/workshop/newapi-integration"
              },
              {
                text: "Integrating PPIO API Model",
                link: "/en/workshop/ppio-integration"
              },
              {
                text: "Integrating 302.AI Models",
                link: "/en/workshop/302ai-integration"
              }
            ],
          },
          {
            text: "[Beta] Service API Reference",
            items: [
              { text: "Overview", link: "/en/tags/readme" },
              { text: "Webhooks", link: "/en/tags/webhook" },
              ...sidebarEn.generateSidebarGroups({
                linkPrefix: '/en/tags/',
              }).map(group => ({
                ...group,
                collapsed: true,
              })),
            ],
          },
          {
            text: "Development",
            items: [
              { text: "Development Configuration", link: "/en/develop/dev-config" },
              { text: "Component Architecture", link: "/en/develop/comp-arch" },
              { text: "Plugin Runtime", link: "/en/develop/plugin-runtime" },
            ],
          },
        ],

        // edit link
        editLink: {
          pattern:
            "https://github.com/langbot-app/Langbot-Wiki/edit/main/docs/:path",
        },

        // social links in the navbar
        socialLinks: [
          {
            icon: "github",
            link: "https://github.com/langbot-app/LangBot",
          },
        ],
      },
    },
  },

  // 最后更新时间
  lastUpdated: true,
});
