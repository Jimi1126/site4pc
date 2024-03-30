<script setup>
import { useRouter } from 'vue-router'
import { useDark, useToggle } from '@vueuse/core'
import { Sunny, Moon } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
// import { onMounted } from 'vue'

const router = useRouter()
const isDark = useDark()
const toggleDark = useToggle(isDark)
const nowHour = new Date().getHours()
const theme = localStorage.getItem('theme')
if (theme) {
  isDark.value = theme == 'dark'
} else {
  isDark.value = nowHour < 6 || nowHour > 18
}
watch(isDark, (nv) => {
  localStorage.setItem('theme', nv ? 'dark' : 'light')
})
// onMounted(() => {
//   new TypeIt('#typeIt', {
//     strings: ['真正的大师永远都怀着一颗学徒的心'],
//     afterComplete: async (instance) => {
//       // Will fire after the entire instance has completed typing.
//       // NOTE: If "loop" is enabled, this will never fire.
//       instance.destroy()
//     }
//   }).go()
// })
const adjustH = ref(false)

window.addEventListener('scroll', () => {
  adjustH.value = !!window.scrollY
})
</script>

<template>
  <el-container class="page-wrap">
    <el-header :style="{ height: (adjustH ? '60px' : '120px') }">
      <a @click="router.push('/')">jimi1126</a>
      <p id="typeIt"></p>
      <el-space>
        <el-icon>
          <!-- <Search /> -->
        </el-icon>
        <el-switch v-model="isDark"
                   inline-prompt
                   :active-icon="Sunny"
                   :inactive-icon="Moon"
                   @change="toggleDark" />
      </el-space>
    </el-header>
    <el-container class="page-main">
      <router-view></router-view>
    </el-container>
    <el-footer>
      <span>
        <el-link :underline="false"
                 type="info">©2024</el-link>&nbsp;
        <el-link href="mailto:jimi1126_mid@163.com"
                 type="info">jimi1126</el-link>
      </span>
      <span>
        <el-link href="https://beian.miit.gov.cn/#/Integrated/index"
                 type="info"
                 target="_blank">桂ICP备2024026330号-1</el-link>
      </span>
      <el-space spacer="|">
        <el-link :underline="false"
                 type="info">Power By</el-link>
        <el-link href="https://nodejs.org/en"
                 type="info"
                 target="_blank">nodejs</el-link>
        <el-link href="https://cn.vuejs.org/"
                 type="info"
                 target="_blank">vue</el-link>
        <el-link href="https://element-plus.org/zh-CN/"
                 type="info"
                 target="_blank">element</el-link>
      </el-space>
    </el-footer>
  </el-container>
</template>

<style>
::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 0.3rem; /*高宽分别对应横竖滚动条的尺寸*/
  height: 0.3rem;
  margin: 10px 0;
}
::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  /* border-radius: 10px; */
  box-shadow: var(--el-box-shadow);
  background-color: #409eff;
}
::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: var(--el-box-shadow);
  background: #ededed;
  /* border-radius: 10px; */
}
html {
  --b1: 0 0% 100%;
  --b2: 0 0% 94.902%;
  --b3: 220 23.077% 94.902%;
  --tw-bg-opacity: 1;
}
html.dark {
  --b1: 211.76 22.078% 15.098%;
  --b2: 220 17.241% 17.059%;
  --b3: 240 4.3478% 9.0196%;
  --tw-bg-opacity: 1;
}
</style>

<style scoped>
.page-wrap {
  min-height: 100vh;
  background-color: hsl(var(--b3, var(--b2)) / var(--tw-bg-opacity));
}

.el-header {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100vw;
  font-size: var(--el-font-size-large);
  color: var(--el-text-color-primary);
  border-bottom: var(--el-border);
  box-shadow: var(--el-box-shadow);
  background-image: linear-gradient(
    to top,
    transparent,
    hsl(var(--b3, var(--b2)) / var(--tw-bg-opacity))
  );
  z-index: 999;
  transition: all 200ms;
}

.el-header a {
  cursor: pointer;
  text-decoration: none;
}

.page-main {
  margin-top: 120px;
}

.el-footer {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-items: center;
  align-items: center;
  background-color: var(--el-bg-color);
  box-shadow: var(--el-box-shadow);
  z-index: 888;
}
</style>
