<template>
  <div class="flex space-x-8 p-x-20">
    <section v-loading="essayLoading"
             class="flex-auto shadow-lg dark:!shadow-stone-400">
      <img :src="thePost.cover"
           alt="这是一张风景图片"
           class="w-full h-[calc((100vw - 7rem) * 9/16)] object-cover">
      <article class="relative w-5/6 m-auto shadow-lg -top-48">
        <v-md-editor ref="mdPreview"
                     mode="preview"
                     :model-value="essay.text"></v-md-editor>
      </article>
    </section>
  </div>
  <div class="relative flex items-center h-32 px-20 mx-20 space-x-2 shadow-lg bg-sky-200/80 -top-32">
    <code v-for="tag in thePost.tags"
          :key="tag._id"
          class="px-4 py-2 text-sm rounded-full bg-sky-300 dark:bg-sky-800">{{ tag.name }}</code>
  </div>
  <MenuTree ref="tocTree"
            :data="tocData"
            :clickNode="clickTocNode" />
  <Teleport to="body">
    <div class="fixed flex flex-col space-y-4 transition-all duration-200 bottom-24 right-12">
      <button class="transition duration-200 ease-in-out cursor-pointer hover:-translate-y-1 hover:scale-110"
              @click="showNav">
        <svg xmlns="http://www.w3.org/2000/svg"
             fill="none"
             viewBox="0 0 24 24"
             stroke-width="1.5"
             stroke="currentColor"
             class="w-6 h-6 stroke-sky-700 hover:stroke-sky-500">
          <path stroke-linecap="round"
                stroke-linejoin="round"
                d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>
      </button>
      <button class="transition duration-200 ease-in-out cursor-pointer hover:-translate-y-1 hover:scale-110"
              :class="{'translate-x-20 absolute': !scrolled}"
              @click="goTop">
        <svg xmlns="http://www.w3.org/2000/svg"
             fill="none"
             viewBox="0 0 24 24"
             stroke-width="1.5"
             stroke="currentColor"
             class="w-6 h-6 stroke-sky-700 hover:stroke-sky-500">
          <path stroke-linecap="round"
                stroke-linejoin="round"
                d="m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </button>
      <button class="transition duration-200 ease-in-out cursor-pointer hover:-translate-y-1 hover:scale-110"
              :class="{'translate-x-20 absolute': isBottom}"
              @click="goBottom">
        <svg xmlns="http://www.w3.org/2000/svg"
             fill="none"
             viewBox="0 0 24 24"
             stroke-width="1.5"
             stroke="currentColor"
             class="w-6 h-6 stroke-sky-700 hover:stroke-sky-500">
          <path stroke-linecap="round"
                stroke-linejoin="round"
                d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>

      </button>
    </div>
  </Teleport>
</template>

<script setup>
import { nextTick, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useRequest } from 'alova'
import { useScroll } from '@/hooks/scroll'
import { useEssNav } from '@/hooks/essNav'
import restful from '@/api'
import MenuTree from '@/components/MenuTree.vue'

const mdPreview = ref(undefined)
const tocData = ref([])
const route = useRoute()
const { scrolled, isBottom } = useScroll()
const tocTree = ref(null)

const { data: thePost, send: getPost } = useRequest(restful.getPost, {
  initialData: [],
  immediate: false
})
const {
  loading: essayLoading,
  data: essay,
  send: getEssay
} = useRequest(restful.getEssay, {
  initialData: {},
  immediate: false
})

getPost(route.params.id).then(() => {
  getEssay(thePost.value.essay).then(() => {
    const $title = document.createElement('div')
    $title.setAttribute('data-v-md-line', '0')
    $title.innerHTML = `<h1 align="center">${thePost.value.title}</h1>`
    document.title = thePost.value.title
    const mdbody = document.querySelector('.vuepress-markdown-body')
    mdbody.insertBefore($title, mdbody.firstChild)
    nextTick(initToc)
  })
})

function initToc() {
  const { makeToc, syncScrollTocTree } = useEssNav('.vuepress-markdown-body')
  tocData.value = makeToc()
  syncScrollTocTree((id) => {
    tocTree.value && tocTree.value.setClickId(id)
  })
}

function clickTocNode(toc) {
  document.getElementById(toc.id).scrollIntoView({ block: 'center', behavior: 'smooth' })
}

function showNav() {
  tocTree.value && (tocTree.value.visible = !tocTree.value.visible)
}

function goTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
function goBottom() {
  window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })
}
</script>
<style>
.v-md-editor--preview {
  background: unset;
}
.light .vuepress-markdown-body {
  background-color: #f9fafb;
  color: #1f2937;
  transition: 0.3s;
}
.dark .vuepress-markdown-body {
  background-color: #404040;
  color: rgb(243 244 246);
  transition: 0.3s;
}
</style>
