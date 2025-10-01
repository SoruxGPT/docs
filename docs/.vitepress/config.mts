import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "SoruxGPT 官网介绍",
  description: "SoruxGPT 官网文档介绍",
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '生态介绍', link: '/env' },
      { text: '购买介绍', link: '/buy' },
      { text: '监控服务', link: 'https://status.soruxgpt.com/status/soruxgpt' },
      { text: '官网站点', link: 'https://www.soruxgpt.com' }
    ],

    sidebar: [
      {
        text: '生态介绍',
        items: [
          { text: 'SoruxGPT 现有服务', link: '/env' },
          { text: 'SoruxGPT 更新说明', link: '/gptreleases' },
        ]
      },
      {
        text: '技术介绍',
        items: [
          { text: 'SoruxGPT 功能特点', link: '/feature' },
        ]
      },
      {
        text: '用户服务',
        items: [
          { text: 'SoruxGPT 常见问题', link: '/faq' },
          { text: 'SoruxGPT 功能说明', link: '/intro' },
        ]
      },
      {
        text: '技术部署',
        items: [
          { text: 'SoruxGPT Claude 部署', link: '/claude-deploy' },
          { text: 'SoruxGPT MidJourney 部署', link: '/midjourney-deploy' },
          { text: 'SoruxGPT Sora 部署', link: '/sora-deploy' },
          { text: 'SoruxGPT SaaS GPT', link: '/gpt-saas' },
        ]
      },
      {
        text: 'SaaS Nexus',
        items: [
          { text: '介绍', link: '/saas-nexus-intro' },
        ]
      },
      {
        text: '技术支持',
        items: [
          { text: 'SoruxGPT Claude 部署常见问题', link: '/claude-problem' },
          { text: 'SoruxGPT Claude API', link: '/claude-api' },
          { text: 'SoruxGPT ChatGPT SaaS API', link: '/gpt-api' },
        ]
      },
      {
        text: '购买介绍',
        items: [
          { text: 'SoruxGPT 购买方式', link: '/buy' },
          { text: 'SoruxGPT 隐私协议', link: '/privacy' },
          { text: 'SoruxGPT 用户协议', link: '/terms' },
          { text: 'SoruxGPT 语音模式', link: '/voice' },
          { text: 'SoruxGPT 使用教程', link: '/use' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/liaosunny123/Sorux-GPT-Panel' }
    ]
  }
})
