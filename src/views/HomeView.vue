<template>
  <!-- <el-aside>
    <el-card class="avatar-card">
      <el-avatar :size="120"
                 :src='avatar' />
      <el-space>
        <el-icon>
          <ChatLineSquare />
        </el-icon>
        <el-icon>
          <MessageBox />
        </el-icon>
        <el-icon>
          <Wallet />
        </el-icon>
      </el-space>
      <div>
        <p>每个认真生活的人，都值得被认真对待</p>
      </div>
    </el-card>
    <el-card v-loading="catalogLoading">
      <template #header>
        <div class="card-header">
          <span>分类</span>
        </div>
      </template>
      <el-menu @select="(index)=> getPosts({catalog: index})">
        <template v-for="pcatalog in catalogTreeData"
                  :key="pcatalog._id">
          <el-menu-item v-if="!pcatalog.children.length"
                        :index="pcatalog._id">
            <span>{{pcatalog.name}}</span>
          </el-menu-item>
          <el-sub-menu v-else
                       :index="pcatalog._id">
            <template #title>
              <span>{{pcatalog.name}}</span>
            </template>
            <el-menu-item v-for="catalog in pcatalog.children"
                          :key="catalog._id"
                          :index="catalog._id">
              <span>{{catalog.name}}</span>
            </el-menu-item>
          </el-sub-menu>
        </template>
      </el-menu>
    </el-card>
  </el-aside> -->
  <el-main v-loading="postListLoading">
    <el-card v-for="post in posts"
             :key="post._id"
             class="post-card"
             shadow="hover"
             @click="openPost(post._id)">
      <el-avatar :size="320"
                 shape="square"
                 :src='post.cover' />
      <div class="post-card-tag">
        <template v-if="!post.tags || !post.tags.length">
          <el-tag size="small">无标签</el-tag>
        </template>
        <el-tag v-for="tag in post.tags"
                :key="tag._id"
                size="small"
                :color="tag.color">{{ tag.name }}</el-tag>
      </div>
      <div class="post-card-details">
        <span :underline="false"
              class="post-card-details-title"
              type="primary">
          {{ post.title }}
        </span>
        <el-text truncated
                 class="post-card-details-desc">
          {{ post.desc }}
        </el-text>
      </div>
    </el-card>
  </el-main>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRequest } from 'alova'
import restful from '@/api'

const router = useRouter()

function openPost(_id) {
  router.push({ path: '/post/' + _id })
}

// 目录
// const { loading: catalogLoading, data: catalogs } = useRequest(restful.getCatalogs, {
//   initialData: []
// })
// const catalogTreeData = computed(() => {
//   const tree = catalogs.value.filter((t) => !t.pid)
//   const children = catalogs.value.filter((t) => t.pid)
//   tree.forEach((t) => {
//     t.children = children.filter((tt) => tt.pid == t._id)
//   })
//   return tree
// })

const {
  loading: postListLoading,
  data: posts,
  send: getPosts
} = useRequest(restful.getPosts, {
  initialData: [],
  immediate: false
})

onMounted(() => {
  getPosts({ publish: true })
})
</script>

<style>
:root {
  --card-columns-width: 320px;
}
</style>
<style scoped>
:root {
  --card-columns-height: 320px;
}
.el-aside {
  --el-aside-padding: 20px;
  display: grid;
  row-gap: var(--el-font-line-height-primary);
  height: fit-content;
  padding: var(--el-aside-padding);
}
.avatar-card > :deep(.el-card__body) {
  display: grid;
  row-gap: var(--el-font-size-base);
  justify-items: center;
}

.el-menu {
  border-right: unset;
}

.el-main {
  display: grid;
  grid-template-columns: repeat(auto-fill, var(--card-columns-width));
  gap: calc(var(--el-font-size-base) * 2);
  justify-content: center;
  height: fit-content;
}

.post-card {
  cursor: pointer;
}

.post-card > :deep(.el-card__body) {
  display: grid;
  grid-template-columns: var(--card-columns-width);
  column-gap: var(--el-font-size-base);
  padding: 0;
}

.post-card-tag {
  display: flex;
  flex-wrap: wrap;
  padding: var(--el-card-padding);
}

.post-card-details {
  display: grid;
  grid-template-rows: var(--el-font-line-height-primary) auto;
  row-gap: var(--el-font-size-base);
  padding: var(--el-card-padding);
  padding-top: unset;
}

.post-card-details-title {
  font-size: var(--el-font-size-large);
  font-weight: bold;
  justify-content: flex-start;
  align-self: start;
  white-space: break-spaces;
  -webkit-line-clamp: 1;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
.post-card-details-desc {
  align-self: start;
  white-space: break-spaces;
  -webkit-line-clamp: 3;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>