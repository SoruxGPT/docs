import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "SoruxGPT 官网介绍",
  description: "SoruxGPT 官网文档介绍",
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '生态介绍', link: '/env' },
      { text: '购买介绍', link: '/buy' },
      { text: '监控服务', link: 'https://status.sorux.cn/status/sorux-gpt' },
      { text: '官网站点', link: 'https://www.soruxgpt.com' }
    ],

    sidebar: [
      {
        text: '生态介绍',
        items: [
          { text: 'SoruxGPT 现有服务', link: '/env' },
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
        ]
      },
      {
        text: '技术部署',
        items: [
          { text: 'SoruxGPT Claude 部署', link: '/claude-deploy' },
          { text: 'SoruxGPT MidJourney 部署', link: '/midjourney-deploy' },
        ]
      },
      {
        text: '技术支持',
        items: [
          { text: 'SoruxGPT Claude 部署常见问题', link: '/claude-problem' },
          { text: 'SoruxGPT Claude API', link: '/claude-api' },
        ]
      },
      {
        text: '购买介绍',
        items: [
          { text: 'SoruxGPT 购买方式', link: '/buy' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/liaosunny123/Sorux-GPT-Panel' }
    ]
  }
})
