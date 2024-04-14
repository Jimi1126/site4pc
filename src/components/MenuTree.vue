<template>
  <Teleport to="body">
    <div id="menuTree"
         class="fixed z-50 p-4 space-y-2 transition-transform duration-200 ease-in shadow-lg bottom-52 right-6 bg-stone-50 dark:bg-stone-600"
         :class="visible ? '' : 'translate-x-[30rem]'">
      <div class="p-2 border-b border-gray-600">快速导航</div>
      <div class="py-8 overflow-auto w-80 max-h-80">
        <Tree v-bind="$attrs" />
      </div>
    </div>
  </Teleport>
</template>
<script>
import { provide, ref } from 'vue'
import Tree from './RecurTree.vue'

export default {
  components: {
    Tree
  },
  setup() {
    const clickId = ref('')
    const visible = ref(false)
    provide('clickId', clickId)
    function setClickId(id) {
      clickId.value = id
      scrollNode(id)
    }
    function scrollNode(id) {
      document
        .getElementById('menuTree')
        .querySelector(`li[li-id="${id}"]`)
        .scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
    return {
      visible,
      setClickId
    }
  }
}
</script>
