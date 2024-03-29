<script setup>
import { useRouter } from 'vue-router'
import { useDark, useToggle } from '@vueuse/core'
import { Sunny, Moon } from '@element-plus/icons-vue'
// import { onMounted } from 'vue'

const router = useRouter()
const isDark = useDark()
isDark.value = true
const toggleDark = useToggle(isDark)
const nowHour = new Date().getHours()
isDark.value = nowHour < 6 || nowHour > 18
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
</script>

<template>
  <el-container class="page-wrap">
    <el-header>
      <a @click="router.push('/')">小码农日记</a>
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
      @Auther by Jimmy
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
}

.el-header a {
  cursor: pointer;
  text-decoration: none;
}

.page-main {
  margin-top: 70px;
}

.el-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--el-font-size-base);
  color: var(--el-text-color-primary);
  background-color: var(--el-bg-color);
  border-top: var(--el-border);
  box-shadow: var(--el-box-shadow);
}
</style>
