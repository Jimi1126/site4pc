import { createApp } from 'vue'
import { createPinia } from 'pinia'

import 'virtual:uno.css'
import '@/assets/css/index.css'

import App from '@/App.vue'
import router from '@/router'

import VueMarkdownEditor from '@kangc/v-md-editor'
import '@kangc/v-md-editor/lib/style/base-editor.css'
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js'
import '@kangc/v-md-editor/lib/theme/style/vuepress.css'
import createLineNumbertPlugin from '@kangc/v-md-editor/lib/plugins/line-number/index'
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index'
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css'
import createEmojiPlugin from '@kangc/v-md-editor/lib/plugins/emoji/index'
import '@kangc/v-md-editor/lib/plugins/emoji/emoji.css'
import createTipPlugin from '@kangc/v-md-editor/lib/plugins/tip/index'
import '@kangc/v-md-editor/lib/plugins/tip/tip.css'
// Prism
import Prism from 'prismjs'
// highlight code
import 'prismjs/components/prism-json'

VueMarkdownEditor.use(vuepressTheme, {
  Prism
})

// markdown支持显示代码行数
VueMarkdownEditor.use(createLineNumbertPlugin())
// markdown支持代码快速复制
VueMarkdownEditor.use(createCopyCodePlugin())
// markdown支持emoji
VueMarkdownEditor.use(createEmojiPlugin())
// markdown支持插入提示信息
VueMarkdownEditor.use(createTipPlugin())

const app = createApp(App)

app.use(createPinia())
app.use(router)
// 引入v-md-editor预览组件
app.use(VueMarkdownEditor)

app.mount('#app')
