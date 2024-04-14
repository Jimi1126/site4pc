import { onUnmounted } from 'vue'

let _$el_, _levels_

function makeToc() {
  if (!_$el_ || !_levels_ || !_levels_.length) return []
  // 定义参与目录生成的标签
  const heads = Array.from(_$el_.childNodes).filter((item) => _levels_.includes(item.tagName))
  const to_nodes = []
  let cur_level_nodes = new Array(_levels_.length).fill(0)
  function getParent(level) {
    let p = {}
    for (let i = 0; i < level; i++) {
      if (i == 0) {
        p = to_nodes[cur_level_nodes[i] - 1]
      } else {
        const np = p.children[cur_level_nodes[i] - 1]
        if (np) {
          p = np
        } else {
          break
        }
      }
    }
    return p
  }
  heads.forEach((item) => {
    const level = _levels_.indexOf(item.tagName)
    const id = cur_level_nodes.slice(0, level + 1).reduce((prev, cur) => prev + '-' + cur, 'h')
    item.id = id
    const node = {
      id,
      tag: item.tagName,
      label: item.innerText,
      children: []
    }
    if (level === 0) {
      to_nodes.push(node)
    } else {
      const p = getParent(level)
      p.children = p.children || []
      p.children.push(node)
    }
    for (let i = cur_level_nodes.length - 1; i > level; i--) {
      cur_level_nodes[i] = 0
    }
    cur_level_nodes[level]++
  })
  return to_nodes
}

function isInViewPort(element) {
  const viewWidth = window.innerWidth || document.documentElement.clientWidth
  const viewHeight = window.innerHeight || document.documentElement.clientHeight
  const { top, right, bottom, left } = element.getBoundingClientRect()
  return top >= 0 && left >= 0 && right <= viewWidth && bottom <= viewHeight
}
function syncScrollTocTree(cb) {
  let beforeOffsetTop = 0
  const nodes = _$el_.querySelectorAll(_levels_)
  const total = nodes.length
  const hander = () => {
    // 往下滚动
    if (document.documentElement.scrollTop - beforeOffsetTop > 0) {
      for (let i = 0; i < total; i++) {
        if (isInViewPort(nodes[i])) {
          cb(nodes[i].id)
          break
        }
      }
    } else {
      for (let i = total - 1; i >= 0; i--) {
        if (isInViewPort(nodes[i])) {
          cb(nodes[i].id)
          break
        }
      }
    }
    beforeOffsetTop = document.documentElement.scrollTop
  }
  window.addEventListener('scroll', hander)
  onUnmounted(() => {
    window.removeEventListener('scroll', hander)
  })
}

export function useEssNav(seletor, levels = ['H2', 'H3', 'H4']) {
  _levels_ = levels || []
  if (typeof seletor == 'string') {
    _$el_ = document.querySelector(seletor)
  } else {
    _$el_ = seletor
  }
  return { makeToc, syncScrollTocTree }
}
