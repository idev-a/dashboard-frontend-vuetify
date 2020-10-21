<template>
  <v-container
    id="meraki-board"
    fluid
    tag="section"
  >
    <v-card
      class="pa-5"
    >
      <v-card-title>
        Tree Board
        <v-spacer></v-spacer>
        <v-btn class="main" :loading="loading" @click="generate" :disabled="loading">
          Generate
          <v-icon right>mdi-send</v-icon>
        </v-btn>
      </v-card-title>
      <vue-json-editor v-model="treeData" :show-btns="true" :expandedOnStart="true" @json-change="onJsonChange"></vue-json-editor>
      <v-card-text>
        <div id="tree" />
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
  import vueJsonEditor from 'vue-json-editor'
  import * as d3 from "d3";

  export default {
    name: 'TreeBoard',

    components: {
      vueJsonEditor
    },

    data() {
      return {
        loading: false,
        treemap: null,
        svg: null,
        root: null,
        i: 0,
        treeData: {
          "name": "NODE NAME 1",  
          "subname": "CODE N1",    
          "fill":"orange",
          "children": [
            { 
              "name": "NODE NAME 2.1",
              "subname": "CODE N1",    
              "fill":"blue"
            },
            { "name": "NODE NAME 2.2","subname": "CODE N1"  ,"fill":"blue" },
            { "name": "NODE NAME 2.3","subname": "CODE N1","fill":"blue",
            "children": [
                { "name": "NODE NAME 3.3","fill":"blue","subname": "CODE N1",
                 "children": [{
                     "name":"NODE NAME 4.1","subname": "CODE N1",
                     "fill":"#d281d2"
                 }
                     ] },
                { "name": "NODE NAME 3.4","fill":"blue", "subname": "CODE N1" ,
                 "children": [{
                     "name":"NODE NAME 4.2", "subname": "CODE N1" ,
                     "fill":"#d281d2"
                 }
                     ]
                 }
              ]
              }
          ]
        }
      }
    },

    mounted () {
      this.generate()
    },

    watch: {
      treeData: {
        handler (v) {
          this.generate()
        },
        deep: true
      }
    },

    methods: {
      onJsonChange (value) {
        console.log('value:', value)
      },
      generate () {
        d3.select("svg").remove()

        var margin = {top: 20, right: 90, bottom: 30, left: 90},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        this.svg = d3.select("#tree").append("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate("
                  + margin.left + "," + margin.top + ")");

        // declares a tree layout and assigns the size
        this.treemap = d3.tree().size([height, width]);

        // Assigns parent, children, height, depth
        this.root = d3.hierarchy(this.treeData, function(d) { return d.children; });
        this.root.x0 = height / 2;
        this.root.y0 = 0;

        // Collapse after the second level
        this.root.children.forEach(this.collapse);

        this.update(this.root);
      },

      collapse(d) {
        if(d.children) {
          d._children = d.children
          d._children.forEach(this.collapse)
          d.children = null
        }
      },

      update(source) {
        var self = this
        var duration = 550
        // Assigns the x and y position for the nodes
        var treeData = this.treemap(this.root);

        // Compute the new tree layout.
        var nodes = treeData.descendants(),
            links = treeData.descendants().slice(1);

        // Normalize for fixed-depth.
        nodes.forEach(function(d){ d.y = d.depth * 180});

        // ****************** Nodes section ***************************

        // Update the nodes...
        var node = this.svg.selectAll('g.node')
          .data(nodes, function(d) {return d.id || (d.id = ++this.i); });

        // Enter any new modes at the parent's previous position.
        var nodeEnter = node.enter().append('g')
            .attr('class', 'node')
            .attr("transform", function(d) {
              return "translate(" + source.y0 + "," + source.x0 + ")";
          })
          .on('click', this.click);

          var rectHeight = 60, rectWidth = 120;
          
          nodeEnter.append('rect')
            .attr('class', 'node')
            .attr("width", rectWidth)
            .attr("height", rectHeight)
            .attr("x", 0)
            .attr("y", (rectHeight/2)*-1)
            .attr("rx","5")
            .style("fill", function(d) {
                return d.data.fill;
            });

        // Add labels for the nodes
        nodeEnter.append('text')
            .attr("dy", "-.35em")
            .attr("x", function(d) {
              return 13;
            })
            .attr("text-anchor", function(d) {
              return "start";
            })
            .text(function(d) { return d.data.name; })
            .append("tspan")
            .attr("dy", "1.75em")
            .attr("x", function(d) {
              return 13;
            })
            .text(function(d) { return d.data.subname; });

        // UPDATE
        var nodeUpdate = nodeEnter.merge(node);

        // Transition to the proper position for the node
        nodeUpdate.transition()
          .duration(duration)
          .attr("transform", function(d) { 
              return "translate(" + d.y + "," + d.x + ")";
           });

        // Update the node attributes and style
        nodeUpdate.select('circle.node')
          .attr('r', 10)
          .style("fill", function(d) {
              return d._children ? "lightsteelblue" : "#fff";
          })
          .attr('cursor', 'pointer');


        // Remove any exiting nodes
        var nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function(d) {
                return "translate(" + source.y + "," + source.x + ")";
            })
            .remove();

        // On exit reduce the node circles size to 0
        nodeExit.select('circle')
          .attr('r', 1e-6);

        // On exit reduce the opacity of text labels
        nodeExit.select('text')
          .style('fill-opacity', 1e-6);

        // ****************** links section ***************************

        // Update the links...
        var link = this.svg.selectAll('path.link')
            .data(links, function(d) { return d.id; });

        // Enter any new links at the parent's previous position.
        var linkEnter = link.enter().insert('path', "g")
            .attr("class", "link")
            .attr('d', function(d){
              var o = {x: source.x0, y: source.y0}
              return self.diagonal(o, o)
            });

        // UPDATE
        var linkUpdate = linkEnter.merge(link);

        // Transition back to the parent element position
        linkUpdate.transition()
            .duration(duration)
            .attr('d', function(d){ return self.diagonal(d, d.parent) });

        // Remove any exiting links
        var linkExit = link.exit().transition()
            .duration(duration)
            .attr('d', function(d) {
              var o = {x: source.x, y: source.y}
              return self.diagonal(o, o)
            })
            .remove();

        // Store the old positions for transition.
        nodes.forEach(function(d){
          d.x0 = d.x;
          d.y0 = d.y;
        });
        // Creates a curved (diagonal) path from parent to the child nodes
      },
      showMessage (d) {
        console.log(d)
      },
      diagonal(s, d) {
        return `M ${s.y} ${s.x}
                C ${(s.y + d.y) / 2} ${s.x},
                  ${(s.y + d.y) / 2} ${d.x},
                  ${d.y} ${d.x}`
      },

      // Toggle children on click.
      click(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
          } else {
            d.children = d._children;
            d._children = null;
          }
        this.update(d);
      }
    }
  }
</script>
<style>
  .node rect {
      stroke-width: 3px;
  }
  
  .node text {
      font: 12px sans-serif;
      fill: #fff;
  }
  
  .link {
      fill: none;
      stroke: #ccc;
      stroke-width: 2px;
  }
</style>