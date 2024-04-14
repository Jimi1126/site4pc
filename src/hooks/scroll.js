import { onUnmounted, ref } from 'vue'

export function useScroll() {
  const isTop = ref(false)
  const isBottom = ref(false)
  const scrolled = ref(false)
  function handleScroll(e) {
    const scrollTop = document.documentElement.scrollTop //滚动高度
    const clientHeight = document.documentElement.clientHeight //可视高度
    const scrollHeight = document.documentElement.scrollHeight //内容高度

    isTop.value = !scrollTop
    isBottom.value = scrollTop + clientHeight + 10 >= scrollHeight
    scrolled.value = scrollTop > 10
  }
  window.addEventListener('scroll', handleScroll)
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
  return { isTop, isBottom, scrolled }
}
