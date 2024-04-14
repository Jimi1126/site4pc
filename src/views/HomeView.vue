<template>
  <section v-loading="postListLoading"
           class="grid justify-center gap-12 grid-cols-auto">
    <template v-for="post in posts"
              :key="post._id">
      <div class="flex flex-col justify-between h-48 p-4 space-y-4 border shadow-xl w-80 rounded-xl border-stone-200 dark:shadow-stone-400 dark:border-stone-600 hover:cursor-pointer"
           @click="openPost(post._id)">
        <div class="w-full text-lg truncate line-clamp-1">{{ post.title }}</div>
        <div class="flex-1 w-full break-all truncate line-clamp-3 text-wrap">{{ post.desc }}</div>
        <div class="space-x-2 break-words truncate line-clamp-1">
          <code v-for="tag in post.tags"
                :key="tag._id"
                class="px-4 py-2 text-sm rounded-full bg-sky-200 dark:bg-sky-800">{{ tag.name }}</code>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup>
import { onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { useRequest } from 'alova'
import restful from '@/api'

const router = useRouter()

function openPost(_id) {
  router.push({ path: '/post/' + _id })
}

const {
  loading: postListLoading,
  data: posts,
  send: getPosts
} = useRequest(restful.getPosts, {
  initialData: [],
  immediate: false
})

onBeforeMount(() => {
  getPosts({ publish: true })
})
</script>
