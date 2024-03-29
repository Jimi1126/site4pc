<script setup>
import { nextTick, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRequest } from 'alova'
import restful from '@/api'

const mdPreview = ref(undefined)
const tocTree = ref(undefined)
const tocData = ref([])
const router = useRouter()
const route = useRoute()

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
    const mdbody = mdPreview.value.$el.querySelector('.vuepress-markdown-body')
    mdbody.insertBefore($title, mdbody.firstChild)
    makeToc()
    nextTick(scrollSyncTocTree)
  })
})

// 将一个集合的数据变成一个树形的数据结构
function toTree(data) {
  // 删除 所有 children,以防止多次调用
  data.forEach(function (item) {
    delete item.children
  })

  // 将数据存储为 以 id 为 KEY 的 map 索引数据列
  var map = {}
  data.forEach(function (item) {
    map[item.id] = item
  })
  var val = []
  data.forEach(function (item) {
    // 以当前遍历项的pid,去map对象中找到索引的id
    var parent = map[item.p_id]
    // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
    if (parent) {
      ;(parent.children || (parent.children = [])).push(item)
    } else {
      //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
      val.push(item)
    }
  })
  return val
}

/**
 * 生成目录
 **/
function makeToc() {
  // 定义参与目录生成的标签
  const tocTags = ['H2', 'H3', 'H4']

  // 目录树结果
  const tocArr = []

  // 获取所有标题标签
  const headDoms = Array.from(
    mdPreview.value.$el.querySelector('.vuepress-markdown-body').childNodes
  ).filter((item) => tocTags.includes(item.tagName))

  // 遍历标题标签
  headDoms.forEach((item, index, arr) => {
    // 给标题添加id
    item.id = `h-${index + 1}`
    // 获取当前节点前面的节点
    let prevs = arr.filter((i, j) => j < index)
    // 过滤前面的节点为合理节点
    // 如 h3节点前  只能为 h1 h2 h3
    prevs = prevs.filter((i) =>
      tocTags.filter((i, j) => j <= tocTags.findIndex((i) => i == item.tagName)).includes(i.tagName)
    )
    // 对前面的节点进行排序，距离自身节点近的排在前面
    // 如 div > p > span > img  当前为img
    // 常规获取节点为 [div,p,span,img]
    // 排序后获取节点为 [img,span,p,div]
    prevs = prevs.sort((a, b) => -a.id.replace('h-', '') - b.id.replace('h-', ''))
    // 查询距离自身节点最近的不同于当前标签的节点
    const prev = prevs.find((i) => i.tagName != item.tagName)
    // this.maxum = Math.max(this.maxum, index + 1)
    tocArr.push({
      id: index + 1, // 抛出id
      tag: item.tagName, // 抛出标签名称
      label: item.innerText, // 抛出标题
      p_id: item.tagName == 'H1' || prev == null ? 0 : Number(prev.id.replace('h-', '')) // 抛出父级id
    })
  })

  // 使用上述方法生成树 最后在el-tree的data中使用 tocData即可
  tocData.value = toTree(tocArr)
}

const curNodeKey = ref(1)
function handleNodeClick(toc) {
  document.getElementById(`h-${toc.id}`).scrollIntoView({ behavior: 'smooth' })
}

function isInViewPort(element) {
  const viewWidth = window.innerWidth || document.documentElement.clientWidth
  const viewHeight = window.innerHeight || document.documentElement.clientHeight
  const { top, right, bottom, left } = element.getBoundingClientRect()

  return top >= 0 && left >= 0 && right <= viewWidth && bottom <= viewHeight
}

function scrollSyncTocTree() {
  // let beforeOffsetTop = 0
  // window.addEventListener('scroll', () => {
  //   // 往下滚动
  //   if (document.documentElement.scrollTop - beforeOffsetTop > 0) {
  //     for (let i = 0; i < tocData.value.length; i++) {
  //       const toc = tocData.value[i]
  //       if (isInViewPort(document.getElementById(`h-${toc.id}`))) {
  //         tocTree.value.setCurrentKey(toc.id)
  //       }
  //     }
  //   } else {
  //     for (let i = tocData.value.length - 1; i >= 0; i--) {
  //       const toc = tocData.value[i]
  //       if (isInViewPort(document.getElementById(`h-${toc.id}`))) {
  //         tocTree.value.setCurrentKey(toc.id)
  //       }
  //     }
  //   }
  //   beforeOffsetTop = document.documentElement.scrollTop
  // })
}
</script>
<template>
  <el-main v-loading="essayLoading">
    <div class="post-wrap">
      <el-image style="width: 100%; height: calc((100vw - 440px) * 9/16);"
                :src="thePost.cover"
                fit="cover" />
      <v-md-editor ref="mdPreview"
                   :model-value="essay.text"
                   mode="preview"></v-md-editor>
    </div>
  </el-main>
  <el-aside width="360px">
    <el-affix :offset="110">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>快速导航</span>
          </div>
        </template>
        <el-tree ref="tocTree"
                 :data="tocData"
                 node-key="id"
                 :default-expand-all="true"
                 :highlight-current="true"
                 :current-node-key="curNodeKey"
                 @node-click="handleNodeClick" />
      </el-card>
      <el-card class="tag-card">
        <template #header>
          <div class="card-header">
            <span>文章标签</span>
          </div>
        </template>
        <el-space wrap>
          <el-tag v-for="tag in thePost.tags"
                  :key="tag._id"
                  :color="tag.color">{{ tag.name }}</el-tag>
        </el-space>
      </el-card>
    </el-affix>
  </el-aside>
  <el-backtop :visibility-height="0"
              :bottom="88"
              @click="router.back()">
    <el-icon>
      <Back />
    </el-icon>
  </el-backtop>
  <el-backtop />
</template>

<style scoped>
.el-aside {
  display: grid;
  row-gap: var(--el-font-line-height-primary);
  height: fit-content;
  padding: 0 40px 0 0;
}
/* :deep(.el-tree-node:focus > .el-tree-node__content) {
  background-color: unset;
} */
.tag-card {
  margin-top: var(--el-font-line-height-primary);
}
.el-main {
  display: grid;
  row-gap: var(--el-font-size-base);
  height: fit-content;
  padding: 40px;
  overflow: hidden;
}
.post-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 40px;
  border: var(--el-border);
  box-shadow: var(--el-box-shadow);
}
.v-md-editor--preview {
  position: relative;
  width: calc(100% - 160px);
  margin-top: -200px;
  border: var(--el-border);
  box-shadow: var(--el-box-shadow);
}

:deep(.vuepress-markdown-body) {
  background-color: var(--el-bg-color-overlay);
  color: var(--el-text-color-primary);
  transition: var(--el-transition-duration);
}
:deep(.v-md-plugin-tip.tip) {
  background-color: var(--el-color-info-light-3);
}
.el-backtop {
  right: 20px !important;
  z-index: 999;
}
</style>
