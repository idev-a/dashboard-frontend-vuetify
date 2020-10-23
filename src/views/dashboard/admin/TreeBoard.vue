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
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="main" :loading="loading" @click="showSaveDlg" :disabled="loading" v-bind="attrs" v-on="on">
              Save
              <v-icon right>mdi-send</v-icon>
            </v-btn>
          </template>
          <span>Save Tree into DB</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="main" :loading="loading" @click="newTree" :disabled="loading" v-bind="attrs" v-on="on">
              New
              <v-icon right>mdi-plus</v-icon>
            </v-btn>
          </template>
          <span>Creat New Tree</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="main" :loading="loading" @click="read" :disabled="loading" v-bind="attrs" v-on="on">
              Read
              <v-icon right>mdi-database</v-icon>
            </v-btn>
          </template>
          <span>Read Trees from DB</span>
        </v-tooltip>
      </v-card-title>
      <div
        v-if="items.length"
      >
        <v-card
          outlined
        >
          <v-card-title
          >
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              clearable
              class="mb-5"
              single-line
              hide-details
            ></v-text-field>
            <v-spacer></v-spacer>
          </v-card-title>
          <v-card-text>
            <v-data-table
              :items="items"
              :loading="loading"
              :headers="headers"
              fixed-header
              :items-per-page="page"
              item-key="id"
              :search="search"
              @update:items-per-page="getPageNum"
              @click:row="showDetail"
            > 
              <template v-slot:item.action="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn 
                      text 
                      icon 
                      v-on="on"
                      @click.stop="showDetail(item)"
                    >
                      <v-icon>mdi-application</v-icon>
                    </v-btn>
                  </template>
                  <span>Show Tree</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </div>
      <v-row>
        <v-col cols=12 md=9>
          <vue-json-editor 
            v-model="treeData" 
            :expandedOnStart="true" 
            @json-change="onJsonChange"
            mode="code"
          ></vue-json-editor>
        </v-col>
        <v-col cols=12 md=3>
          <v-text-field 
            ref="uuidCopy"
            v-model="uuid"
            prepend-icon="mdi-refresh"
            @click:prepend="generateUUID"
            label="_key"
            dense
            class="mr-2"
          />
          <v-text-field
            type="number"
            v-model="treeConfig.nodeWidth"
            label="Node Distance"
            min=0
            dense
            class="mr-2"
          />
          <v-text-field
            v-if="false"
            type="number"
            v-model="treeConfig.nodeHeight"
            label="Node Width"
            min=0
            dense
            class="mr-2"
          />
          <v-text-field
            type="number"
            v-model="treeConfig.levelHeight"
            label="Path Length"
            min=0
            dense
            class="mr-2"
          />
          <v-select
            v-model="treeConfig.direction"
            :items="directions"
            dense
            label="Direction"
          />
        </v-col>
      </v-row>
        <div class="d-flex">
          <span>{{ title }}</span>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn @click="zoomIn" small fab color="success" v-bind="attrs" v-on="on">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <span>Zoom In</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn @click="zoomOut" small fab color="orange" v-bind="attrs" v-on="on">
                <v-icon>mdi-minus</v-icon>
              </v-btn>
            </template>
            <span>Zoom Out</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn @click="restoreScale" small fab color="orange darken-4" v-bind="attrs" v-on="on"><v-icon>mdi-refresh</v-icon></v-btn>
            </template>
            <span>Reset Zoom</span>
          </v-tooltip>
          <v-menu
            v-if="false"
            open-on-hover
            close-on-content-click
            bottom
            offset-y
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                fab 
                small
                color="main"
                dark
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-export</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item-group
                color="primary"
              >
              <v-list-item
                v-for="(item, index) in exportMenus"
                :key="index"
                @click="exportTree"
              >
                <v-list-item-icon class="mr-3">
                  <v-icon v-text="item.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{item.title}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
            </v-list>
          </v-menu>
        </div>
        <vue-tree
          ref="treeRef"
          class="tree"
          :dataset="treeData"
          :config="treeConfig"
          :direction="treeConfig.direction"
        >
          <template v-slot:node="{ node, collapsed }">
            <div
              class="rich-media-node"
              :style="{ 
                background: node.fill ? node.fill : 'orange'  }"
            >
              <span class="name" 
              >
                {{ node.name }}
              </span>
              <span v-if="node.subname" class="subname">
                {{ node.subname }}
              </span>
            </div>
          </template>
        </vue-tree>
    </v-card>

    <!-- Save Dialog -->
    <v-dialog
      v-model="saveDlg"
      width="500"
    >
      <v-card>
        <v-card-title>
          Save Tree
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="title"
            label="title"
            :rules="[rules.required]"
          >
          </v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="success" text @click="saveDlg=false">Close</v-btn>
          <v-btn color="main" text @click="save" :loading="loading">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="snackbar"
      bottom
      :color="color"
      >
      {{ message }}
      <template v-slot:action="{ attrs }">
        <v-btn
          dark
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>
<script>
  import vueJsonEditor from 'vue-json-editor'
  import Canvg, { presets }  from 'canvg';
  import { mapState } from 'vuex'
  import { Post, Get } from '@/api'
  import { downloadImage } from '@/util'

  export default {
    name: 'TreeBoard',

    components: {
      vueJsonEditor,
      VueTree: () => import('../component/VueTree'),
      TopicTree: () => import('../component/TopicTree'),
      VueTreeCom: () => import('../component/VueTreeCN'),
    },

    data() {
      return {
        loading: false,
        snackbar: false,
        message: '',
        color: 'success',
        saveDlg: false,
        title: '[No Title]',
        uuid: '',
        treeConfig: { nodeWidth: 70, nodeHeight: 30, levelHeight: 150, direction: 'horizontal' },
        defaultConfig: { nodeWidth: 70, nodeHeight: 30, levelHeight: 150, direction: 'horizontal' },
        directions: [
          'horizontal',
          'vertical'
        ],
        treeData: {},
        defaultData: {
          name: "Parent",
          subname: "subname1",
          fill: "#f7c616",
          children:[
            {
              name: "Child",
              subname: "subname1",
              fill: "blue",
              children:[ {name: "GrandChild1"}, {name: "GrandChild2"}]
            },
            {
              name: "Child",
              subname: "subname1",
              fill: "blue",
              children:[ {name: "GrandChild1"}, {name: "GrandChild2"}]
            },
            {
              name: "Child",
              subname: "subname1",
              fill: "blue",
              children:[ {name: "GrandChild1"}, {name: "GrandChild2"}]
            },
            {
              name: "Child",
              subname: "subname1",
              fill: "blue",
              children:[ {name: "GrandChild1"}, {name: "GrandChild2"}]
            },
          ]
        },
        search: '',
        items: [],
        headers: [
          {
            text: 'ID',
            value: 'id'
          },
          {
            text: 'Title',
            value: 'title'
          },
          // {
          //   text: 'Config',
          //   value: 'conf'
          // }
          // {
          //   text: 'Data',
          //   value: 'data'
          // },
          {
            text: 'Date',
            value: 'run_at'
          },
          { text: 'Actions', value: 'action', sortable: false}
        ],
        exportMenus: [
          { title: 'Export as PDF', icon: 'mdi-file-pdf-box' },
          { title: 'Export as PNG', icon: 'mdi-image' }
        ],
        rules: {
          required: value => {
            return !!value || 'This field is required.'
          },
        }
      }
    },

    created () {
      this.generate()
    },

    computed: {
      ...mapState(['page']),
    },

    mounted () {
    },

    methods: {
      onJsonChange (value) {
        console.log('value:', value)
      },
      generate () {
        this.treeData = Object.assign({}, this.defaultData)
        this.treeConfig = Object.assign({}, this.defaultConfig)
        this.addUniqueKey(this.treeData)
        this.restoreScale()
      },
      newTree () {
        const self = this
        this.$dialog.confirm({
          text: 'Do you really want to create new one? The current data will be discarded.',
          title: 'Warning',
          actions: {
            false: 'No',
            true: {
              color: 'red',
              text: 'Yes',
              handle: () => {
                self.generate()
              }
            }
          }
        })
      },
      showSaveDlg () {
        this.title = this.title || '[No Title]'
        this.saveDlg = true
      },
      async save () {
        this.loading = true
        const data = {
          title: this.title,
          conf: this.treeConfig,
          data: this.treeData
        }
        const res = await Post('admin/tree/save', data)
        this.showSnack(res)
        this.saveDlg = false
      },
      async read () {
        this.loading = true
        const res = await Get('admin/tree/read')
        this.showSnack(res)
        if (res.status == 'success') {
          this.items = res.items
        }
      },
      showDetail (item) {
        this.title = item.title
        this.treeConfig = JSON.parse(item.conf)
        this.treeData = JSON.parse(item.data)
      },
      showSnack(res) {
        this.message = res.message
        this.color = res.status
        this.snackbar = true
        this.loading = false
      },
      zoomIn () {
        this.$refs.treeRef.zoomIn()
      },
      zoomOut () {
        this.$refs.treeRef.zoomOut()
      },
      restoreScale () {
        this.$refs.treeRef && this.$refs.treeRef.restoreScale()
      },
      async exportTree (item) {
        let canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const svg = document.querySelector('svg')
        const svgString = this.$refs.treeRef.getSVGString()
        const v = Canvg.fromString(ctx, svgString);

        // Render only first frame, ignoring animations.
        await v.render();

        let imgData = canvas.toDataURL('image/png');
        downloadImage(imgData)
      },
      generateUUID () {
        this.uuid = this.uuid0()
        let uuidCopy = this.$refs.uuidCopy.$el.querySelector('input')
        uuidCopy.select()
        document.execCommand("copy");
      },
      addUniqueKey(rootNode) {
        const queue = [rootNode]
        while (queue.length !== 0) {
          const node = queue.pop()
          node._key = this.uuid0()
          if (node.children) {
            queue.push(...node.children)
          }
        }
        return rootNode
      },
      uuid0() {
        const s = []
        const hexDigits = '0123456789abcdef'
        for (let i = 0; i < 36; i++) {
          s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
        }
        s[14] = '4'
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
        s[8] = s[13] = s[18] = s[23] = '-'
        return s.join('')
      },
      getPageNum (_page) {
        localStorage.setItem('page', _page)
      },
    }
  }
</script>
<style lang="scss">
div.jsoneditor-menu {
  background-color: #2a9be7;
  border-bottom: 1px solid #2a9be7;
}

.jsoneditor-vue .jsoneditor-tree {
  min-height: 450px;
}

.tree {
  min-width: 1000px; 
  height: 850px; 
  margin-top: 10px;
}

.rich-media-node {
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  border-radius: 4px;

  .name {
    font-size: 14px;
    font-weight: bold;
  }

  .subname {
    font-size: 13px;
  }
}
</style>