<template>
  <div :id="id">
  </div>
</template>

<script>
import 'd3-transition'
import * as d3Hierachy from 'd3-hierarchy'
import * as d3Selection from 'd3-selection'
const d3 = {
  ...d3Hierachy,
  ...d3Selection
}
export default {
  name: 'tree',
  props: {
    id: {
      type: String,
      required: true
    },
    data: {
      type: Object,
      required: true
    },
    duration: {
      type: Number,
      required: false,
      default: 750
    },
    children: {
      type: String,
      required: false,
      default: 'children'
    },
    width: {
      type: Number,
      required: false,
      default: 500
    },
    height: {
      type: Number,
      required: false,
      default: 500
    },
    marginWidth: {
      type: Number,
      required: false,
      default: 150
    },
    marginHeight: {
      type: Number,
      required: false,
      default: 30
    },
    linkClass: {
      type: Function,
      required: false,
      default: () => ''
    },
    type: {
      type: String,
      required: false,
      default: 'tree',
      validator: v => ['tree', 'cluster'].includes(v)
    }
  },
  data () {
    return {
      canvas: null,
      tree: null,
      root: null,
      count: 0
    }
  },
  watch: {
    data:  {
      handler (v) {
        this.count = 0
        this.initRoot()
        this.update(this.root)
      },
      deep: true
    },
    marginHeight: 'updateSize',
    marginWidth: 'updateSize',
    type: 'updateSize',
    height: 'updateSize',
    width: 'updateSize'
  },
  computed: {
    treeLayout () {
      const layout = this.type === 'cluster'
        ? d3.cluster()
        : d3.tree()
      return layout
        .size([
          this.height - this.marginHeight * 2,
          this.width - this.marginWidth * 2
        ])
    }
  },
  mounted () {
    this.canvas = d3.select(`#${this.id}`)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('transform', `translate(${this.marginWidth}, ${this.marginHeight})`)
    this.initRoot()
    this.update(this.root)
  },
  methods: {
    initRoot () {
      this.root = d3.hierarchy(this.data, d => d[this.children])
      this.root.x0 = (this.height - this.marginHeight * 2) / 2
      this.root.y0 = 0
    },
    updateSize () {
      const canvas = d3.select(`#${this.id} svg`)
        .transition()
        .duration(this.duration)
        .attr('width', this.width)
        .attr('height', this.height)
      canvas.select('g')
        .attr('transform', `translate(${this.marginWidth}, ${this.marginHeight})`)
      this.update(this.root)
    },
    update (source) {
      this.treeLayout(this.root)
      const nodes = this.root.descendants()
      const links = this.root.descendants().slice(1)
      const node = this.canvas.selectAll(`.tree-node`)
        .data(nodes, d => d.id || (d.id = this.count++))
      const link = this.canvas.selectAll('.tree-link')
        .data(links, d => d.id)
      console.log(nodes, node)
      this.refreshNodes(source, node)
      this.refreshLinks(source, link)
      // save origin for transition
      nodes.forEach(d => {
        d.x0 = d.x
        d.y0 = d.y
      })
    },
    refreshNodes (source, node) {
      // enter
      const nodeEnter = node.enter()
        .append('g')
        .attr('cursor', 'pointer')
        .attr('transform', d => `translate(${source.y0}, ${source.x0})`)
      nodeEnter.append('circle')
        .attr('r', 0)
        .on('click', d => {
          if (d.children) {
            d._children = d.children
            d.children = null
          } else {
            d.children = d._children
            d._children = null
          }
          this.update(d)
        })
      nodeEnter.append('text')
        .text(d => d.data.name)
        .attr('x', d => d.children || d._children ? -13 : 13)
        .attr('y', 4)
        .attr('text-anchor', d => d.children || d._children ? 'end' : 'start')
        .style('fill-opacity', 0)
        .on('click', d => this.$emit('click', d.data))
      // update
      const nodeUpdate = nodeEnter.merge(node)
      nodeUpdate.transition()
        .duration(this.duration)
        .attr('class', 'tree-node')
        .attr('transform', d => `translate(${d.y}, ${d.x})`)
      nodeUpdate.selectAll('circle')
        .classed('tree-circle', true)
        .classed('tree-circle-hide', d => !!d._children)
        .transition()
        .duration(this.duration)
        .attr('r', 5)
        .attr('stroke', 'steelblue')
        .attr('stroke-width', '2px')
        .attr('fill', d => d._children ? 'lightgrey' : 'white')
      nodeUpdate.selectAll('text')
        .transition()
        .duration(this.duration)
        .attr('class', 'tree-text')
        .style('fill-opacity', 1)
      // exit
      const nodeExit = node.exit()
        .transition()
        .duration(this.duration)
        .attr('transform', d => `translate(${source.y}, ${source.x})`)
        .remove()
      nodeExit.select('circle')
        .attr('r', 0)
      nodeExit.select('text')
        .style('fill-opacity', 0)
    },
    refreshLinks (source, link) {
      // enter
      const linkEnter = link.enter()
        .insert('path', 'g')
        .attr('class', d => `tree-link ${this.linkClass(d.data)}`)
        .attr('fill', 'none')
        .attr('stroke', 'gray')
        .attr('d', () => {
          const origin = {x: source.x0, y: source.y0}
          return this.diagonal(origin, origin)
        })
      // update
      const linkUpdate = linkEnter.merge(link)
      linkUpdate.transition()
        .duration(this.duration)
        .attr('d', d => this.diagonal(d, d.parent))
      // exit
      link.exit()
        .transition()
        .duration(this.duration)
        .attr('d', () => this.diagonal(source, source))
        .remove()
    },
    diagonal (s, d) {
      return `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`
    }
  }
}
</script>