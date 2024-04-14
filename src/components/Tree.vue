<template>
  <ul v-for="toc in props.data"
      :key="toc.id"
      class="relative mx-6 transition duration-200 ease-in">
    <span v-if="toc.children.length"
          class="absolute w-6 h-6 p-1 transition-transform cursor-pointer -left-1 top-2"
          :class="[toc.collapse ? '' : 'rotate-90']"
          @click="toggle(toc)">
      <svg xmlns="http://www.w3.org/2000/svg"
           fill="none"
           viewBox="0 0 24 24"
           stroke-width="1.5"
           stroke="currentColor"
           class="w-4 h-4">
        <path stroke-linecap="round"
              stroke-linejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5" />
      </svg>
    </span>
    <li :li-id="toc.id"
        class="px-6 py-1 transition duration-200 ease-in cursor-pointer hover:bg-sky-200 dark:hover:bg-sky-500"
        :class="[clickId == toc.id ? 'bg-sky-300 dark:bg-sky-600' : '']"
        @click="click(toc)">
      {{ toc.label }}
    </li>
    <Tree v-if="!toc.collapse && toc.children.length"
          :data="toc.children"
          :clickNode="clickNode" />
  </ul>
</template>
<script setup>
import { inject } from 'vue'
import Tree from './Tree.vue'
const props = defineProps(['data', 'clickNode'])
const clickId = inject('clickId')
function click(toc) {
  clickId.value = toc.id
  props.clickNode(toc)
}
function toggle(item) {
  item.collapse = !item.collapse
}
</script>