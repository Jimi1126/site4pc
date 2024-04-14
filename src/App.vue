
<template>
  <header class="fixed z-50 flex items-center justify-between w-full px-10 transition-all duration-200 ease-in shadow-lg bg-gradient-to-b"
          :class="[scrolled ? 'h-16' : 'h-32', isDark ? 'from-stone-800' : 'from-stone-200']">
    <router-link to="/"
                 class="text-2xl font-bold transition duration-200 ease-in delay-50 hover:-translate-y-1 hover:scale-110">jimi1126</router-link>
    <div class="flex items-end space-x-8">
      <router-link to="/about"
                   class="text-lg font-medium transition duration-200 ease-in delay-50 hover:-translate-y-1 hover:scale-110">关于我</router-link>
      <router-link to="/about"
                   class="text-lg font-medium transition duration-200 ease-in delay-50 hover:-translate-y-1 hover:scale-110">实验室</router-link>
      <fieldset class="flex p-1 space-x-2 rounded-full bg-sky-100">
        <label class="group p-1 rounded-full transition ease-in duration-200 delay-50 has-[:checked]:bg-sky-400">
          <input type="radio"
                 name="color-scheme"
                 id="color-scheme-light"
                 class="hidden"
                 @click="isDark = false"
                 :checked="!isDark"
                 value="0">
          <svg xmlns="http://www.w3.org/2000/svg"
               fill="none"
               viewBox="0 0 24 24"
               stroke-width="1.5"
               stroke="currentColor"
               class="w-4 h-4 cursor-pointer stroke-stone-700 group-has-[:checked]:stroke-sky-100">
            <path stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
          </svg>

        </label>
        <label class="group  p-1 rounded-full transition ease-in duration-200 delay-50 has-[:checked]:bg-sky-400">
          <input type="radio"
                 name="color-scheme"
                 id="color-scheme-dark"
                 class="hidden"
                 @click="isDark = true"
                 :checked="isDark"
                 value="1">
          <svg xmlns="http://www.w3.org/2000/svg"
               fill="none"
               viewBox="0 0 24 24"
               stroke-width="1.5"
               stroke="currentColor"
               class="w-4 h-4 cursor-pointer stroke-stone-700 group-has-[:checked]:stroke-sky-100">
            <path stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
          </svg>

        </label>
      </fieldset>
    </div>
  </header>
  <main class="flex-auto w-full p-10 mt-32 shadow-lg">
    <router-view></router-view>
  </main>
  <footer class="flex items-center justify-center w-full h-24 px-10 bg-gradient-to-t"
          :class="[isDark ? 'from-stone-800' : 'from-stone-200']">
    <div class="space-x-4 text-gray-500">
      <a href="mailto:jimi1126_mid@163.com">联系我</a>
      <span>&copy;2024</span>
      <a href="https://beian.miit.gov.cn/#/Integrated/index"
         target="_blank">桂ICP备2024026330号-1</a>
    </div>
  </footer>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useScroll } from '@/hooks/scroll'
import { useBackground } from '@/hooks/background'

const { scrolled } = useScroll()
const { changeBackColor, collidingBalls } = useBackground()
const isDark = ref(false)
const nowHour = new Date().getHours()
const theme = localStorage.getItem('theme')

if (theme) {
  isDark.value = theme == 'dark'
  changeBackColor(isDark.value)
} else {
  isDark.value = nowHour < 6 || nowHour > 18
  changeBackColor(isDark.value)
}
watch(
  isDark,
  (nv) => {
    const theme = nv ? 'dark' : 'light'
    const html = document.getElementsByTagName('html')[0]
    html.setAttribute('class', theme)
    html.setAttribute('theme', theme)
    localStorage.setItem('theme', theme)
    changeBackColor(nv)
  },
  { immediate: true }
)
collidingBalls()
onMounted(() => {})
</script>
