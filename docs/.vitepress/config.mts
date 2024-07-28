import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "SoruxGPT",
  description: "SoruxGPT Docs",
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '生态介绍', link: '/env' },
      { text: '购买介绍', link: '/buy' }
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
