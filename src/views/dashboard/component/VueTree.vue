<template>
  <div class="tree-container" ref="container">
    <svg class="svg vue-tree" ref="svg" :style="initialTransformStyle"></svg>

    <div
      class="dom-container"
      ref="domContainer"
      :style="initialTransformStyle"
    >
      <transition-group name="tree-node-item" tag="div">
        <div
          class="node-slot"
          v-for="(node, index) of nodeDataList"
          @click="onClickNode(index)"
          :key="node.data._key"
          :style="{
            left: formatDimension(
              direction === DIRECTION.VERTICAL ? node.x : node.y
            ),
            top: formatDimension(
              direction === DIRECTION.VERTICAL ? node.y : node.x
            ),
            width: formatDimension(config.nodeWidth),
            height: formatDimension(config.nodeHeight)
          }"
        >
          <slot
            name="node"
            v-bind:node="node.data"
            v-bind:collapsed="node.data._collapsed"
          >
            <!-- 默认展示value字段 -->
            <span>{{ node.data.value }}</span>
          </slot>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
import { getSVGString } from '@/util'
import html2canvas from 'html2canvas';
import * as d3 from 'd3'

const MATCH_TRANSLATE_REGEX = /translate\(([^)]*)\)/i
const MATCH_SCALE_REGEX = /scale\((\S*)\)/i
const LinkStyle = {
  CURVE: 'curve',
  STRAIGHT: 'straight'
}
const DIRECTION = {
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal'
}
const DEFAULT_NODE_WIDTH = 100
const DEFAULT_NODE_HEIGHT = 100
const DEFAULT_LEVEL_HEIGHT = 200
const ANIMATION_DURATION = 750
function rotatePoint({ x, y }) {
  return {
    x: y,
    y: x
  }
}
export default {

  name: 'vue-tree',
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          nodeWidth: DEFAULT_NODE_WIDTH,
          nodeHeight: DEFAULT_NODE_HEIGHT,
          levelHeight: DEFAULT_LEVEL_HEIGHT
        }
      }
    },
    linkStyle: {
      type: String,
      default: LinkStyle.CURVE
    },
    direction: {
      type: String,
      default: DIRECTION.VERTICAL
    },
    dataset: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      d3,
      colors: '568FE1',
      nodeDataList: [],
      linkDataList: [],
      initTransformX: 0,
      initTransformY: 0,
      DIRECTION
    }
  },
  computed: {
    initialTransformStyle() {
      return {
        transform: `translate(${this.initTransformX}px, ${this.initTransformY}px)`
      }
    }
  },
  created() {
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.draw()
      this.enableDrag()
      this.initTransform()
    },
    async getSVGString () {
      const canvasData = await html2canvas(document.querySelector('.tree-container'))
      let canvas = document.createElement('canvas');
      canvas.appendChild(canvasData);
      var data = canvas.toDataURL('image/png');
    },
    zoomIn() {
      const originTransformStr = this.$refs.domContainer.style.transform
      // 如果已有scale属性, 在原基础上修改
      let targetScale = 1 * 1.2
      const scaleMatchResult = originTransformStr.match(MATCH_SCALE_REGEX)
      if (scaleMatchResult && scaleMatchResult.length > 0) {
        const originScale = parseFloat(scaleMatchResult[1])
        targetScale *= originScale
      }
      this.setScale(targetScale)
    },
    zoomOut() {
      const originTransformStr = this.$refs.domContainer.style.transform
      // 如果已有scale属性, 在原基础上修改
      let targetScale = 1 / 1.2
      const scaleMatchResult = originTransformStr.match(MATCH_SCALE_REGEX)
      if (scaleMatchResult && scaleMatchResult.length > 0) {
        const originScale = parseFloat(scaleMatchResult[1])
        targetScale = originScale / 1.2
      }
      this.setScale(targetScale)
    },
    restoreScale() {
      this.setScale(1)
    },
    setScale(scaleNum) {
      if (typeof scaleNum !== 'number') return
      const originTransformStr = this.$refs.domContainer.style.transform
      let targetTransform
      if (originTransformStr.match(MATCH_SCALE_REGEX)) {
        targetTransform = originTransformStr.replace(
          MATCH_SCALE_REGEX,
          `scale(${scaleNum})`
        )
      } else {
        targetTransform = originTransformStr + ` scale(${scaleNum})`
      }
      this.$refs.svg.style.transform = targetTransform
      this.$refs.domContainer.style.transform = targetTransform
    },
    isVertial() {
      return this.direction === DIRECTION.VERTICAL
    },
    initTransform() {
      const containerWidth = this.$refs.container.offsetWidth
      const containerHeight = this.$refs.container.offsetHeight
      if (this.isVertial()) {
        this.initTransformX = Math.floor(containerWidth / 2)
        this.initTransformY = Math.floor(this.config.nodeHeight)
      } else {
        this.initTransformX = Math.floor(this.config.nodeWidth)
        this.initTransformY = Math.floor(containerHeight / 2)
      }
    },
    /**
     * 根据link数据,生成svg path data
     */
    generateLinkPath(d) {
      const self = this
      if (this.linkStyle === LinkStyle.CURVE) {
        const linkPath = this.isVertial()
          ? d3.linkVertical()
          : d3.linkHorizontal()
        linkPath
          .x(function (d) {
            return d.x
          })
          .y(function (d) {
            return d.y
          })
          .source(function (d) {
            const sourcePoint = {
              x: d.source.x,
              y: d.source.y
            }
            return self.direction === self.DIRECTION.VERTICAL
              ? sourcePoint
              : rotatePoint(sourcePoint)
          })
          .target(function (d) {
            const targetPoint = {
              x: d.target.x,
              y: d.target.y
            }
            return self.direction === self.DIRECTION.VERTICAL
              ? targetPoint
              : rotatePoint(targetPoint)
          })
        return linkPath(d)
      }
      if (this.linkStyle === LinkStyle.STRAIGHT) {
        // the link path is: source -> secondPoint -> thirdPoint -> target
        const linkPath = d3.path()
        let sourcePoint = { x: d.source.x, y: d.source.y }
        let targetPoint = { x: d.target.x, y: d.target.y }
        if (!this.isVertial()) {
          sourcePoint = rotatePoint(sourcePoint)
          targetPoint = rotatePoint(targetPoint)
        }
        const xOffset = targetPoint.x - sourcePoint.x
        const yOffset = targetPoint.y - sourcePoint.y
        const secondPoint = this.isVertial()
          ? { x: sourcePoint.x, y: sourcePoint.y + yOffset / 2 }
          : { x: sourcePoint.x + xOffset / 2, y: sourcePoint.y }
        const thirdPoint = this.isVertial()
          ? { x: targetPoint.x, y: sourcePoint.y + yOffset / 2 }
          : { x: sourcePoint.x + xOffset / 2, y: targetPoint.y }
        linkPath.moveTo(sourcePoint.x, sourcePoint.y)
        linkPath.lineTo(secondPoint.x, secondPoint.y)
        linkPath.lineTo(thirdPoint.x, thirdPoint.y)
        linkPath.lineTo(targetPoint.x, targetPoint.y)
        return linkPath.toString()
      }
    },
    // 使用扇形数据开始绘图
    draw() {
      const [nodeDataList, linkDataList] = this.buildTree(this.dataset)
      this.linkDataList = linkDataList
      this.svg = this.d3.select(this.$refs.svg)
      const self = this
      const links = this.svg.selectAll('.link').data(linkDataList, (d) => {
        return `${d.source._key}-${d.target._key}`
      })
      links
        .enter()
        .append('path')
        .style('opacity', 0)
        .transition()
        .duration(ANIMATION_DURATION)
        .ease(d3.easeCubicInOut)
        .style('opacity', 1)
        .attr('class', 'link')
        .attr('d', function (d, i) {
          return self.generateLinkPath(d)
        })
      links
        .transition()
        .duration(ANIMATION_DURATION)
        .ease(d3.easeCubicInOut)
        .attr('d', function (d) {
          return self.generateLinkPath(d)
        })
      links
        .exit()
        .transition()
        .duration(ANIMATION_DURATION / 2)
        .ease(d3.easeCubicInOut)
        .style('opacity', 0)
        .remove()
      this.nodeDataList = nodeDataList
    },
    buildTree(rootNode) {
      const treeBuilder = this.d3
        .tree()
        .nodeSize([this.config.nodeWidth, this.config.levelHeight])
      const tree = treeBuilder(this.d3.hierarchy(rootNode))
      return [tree.descendants(), tree.links()]
    },
    enableDrag() {
      const svgElement = this.$refs.svg
      const container = this.$refs.container
      let startX = 0
      let startY = 0
      let isDrag = false
      // 保存鼠标点下时的位移
      let mouseDownTransform = ''
      container.onmousedown = (event) => {
        // console.log(event)
        mouseDownTransform = svgElement.style.transform
        startX = event.clientX
        startY = event.clientY
        isDrag = true
      }
      container.onmousemove = (event) => {
        if (!isDrag) return
        const originTransform = mouseDownTransform
        let originOffsetX = 0
        let originOffsetY = 0
        if (originTransform) {
          const result = originTransform.match(MATCH_TRANSLATE_REGEX)
          if (result !== null && result.length !== 0) {
            const [offsetX, offsetY] = result[1]
              .split(',')
              .map(this.parseDimensionNumber)
            originOffsetX = offsetX
            originOffsetY = offsetY
          }
        }
        let transformStr = `translate(${
          event.clientX - startX + originOffsetX
        }px, ${event.clientY - startY + originOffsetY}px)`
        if (originTransform) {
          transformStr = originTransform.replace(
            MATCH_TRANSLATE_REGEX,
            transformStr
          )
        }
        // console.log('transformStr: '  + transformStr)
        svgElement.style.transform = transformStr
        this.$refs.domContainer.style.transform = transformStr
      }
      container.onmouseup = (event) => {
        startX = 0
        startY = 0
        isDrag = false
      }
    },
    onClickNode(index) {
      // console.log(this.nodeDataList[index])
      const curNode = this.nodeDataList[index]
      if (curNode.data.children) {
        curNode.data._children = curNode.data.children
        curNode.data.children = null
        curNode.data._collapsed = true
      } else {
        curNode.data.children = curNode.data._children
        curNode.data._children = null
        curNode.data._collapsed = false
      }
      this.draw()
    },
    formatDimension(dimension) {
      if (typeof dimension === 'number') return `${dimension}px`
      if (dimension.indexOf('px') !== -1) {
        return dimension
      } else {
        return `${dimension}px`
      }
    },
    parseDimensionNumber(dimension) {
      if (typeof dimension === 'number') {
        return dimension
      }
      return parseInt(dimension.replace('px', ''))
    }
  },
  watch: {
    dataset: {
      handler (v) {
        this.draw()
      },
      deep: true
    },
    config: {
      handler (v) {
        this.draw()
      },
      deep: true
    },
    direction () {
      this.draw()
    }
  }
}
</script>

<style lang="scss">
.tree-container {
  .node {
    fill: grey !important;
  }
  .link {
    stroke-width: 2px !important;
    fill: transparent !important;
    stroke: #cecece !important;
  }
}
</style>

<style lang="scss" scoped>
.tree-node-item-enter,
.tree-node-item-leave-to {
  transition-timing-function: ease-in-out;
  transition: transform 0.8s;
  opacity: 0;
}
.tree-node-item-enter-active,
.tree-node-item-leave-active {
  transition-timing-function: ease-in-out;
  transition: all 0.8s;
}
.tree-container {
  position: relative;
  overflow: hidden;
  .vue-tree {
    position: relative;
  }
  > svg,
  .dom-container {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    overflow: visible;
    transform-origin: 0 50%;
  }
  .dom-container {
    z-index: 1;
    // pointer-events: none;
  }
}
.node-slot {
  cursor: pointer;
  position: absolute;
  background-color: transparent;
  box-sizing: border-box;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: content-box;
  transition: all 0.8s;
  transition-timing-function: ease-in-out;
}
</style>