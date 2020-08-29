<template>
  <v-container
    id="register-account"
    class="justify-center"
    tag="section"
  >
    <blockquote class="blockquote">Manage the help section.</blockquote>

    <v-card
      class="pa-3"
    >
      <v-card-title>
        Help Board
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn :loading="loading" v-bind="attrs" v-on="on" :disabled="loading"  class="mr-2" @click="showCreateDialog()" color="main"><v-icon left size="16">mdi-plus</v-icon>Add</v-btn>
          </template>
          <span>Create new help</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn :loading="loading" v-bind="attrs" v-on="on" :disabled="loading"  class="mr-2" @click="readAllHelps()" color="main"><v-icon left size="16">mdi-database</v-icon>Read</v-btn>
          </template>
          <span>Read helps</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn :loading="loading" v-bind="attrs" v-on="on" :disabled="loading || items.length == 0"  class="mr-2" @click="showManageDlg()" color="main"><v-icon left size="16">mdi-drag-variant</v-icon>Manage</v-btn>
          </template>
          <span>Arrange the order of helps</span>
        </v-tooltip>
      </v-card-title>

      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          class="mb-5"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer />
      </v-card-title>

      <v-card-text>
        <v-data-table
          v-model="selectedItems"
          :loading="loading"
          :headers="headers"
          :items="items"
          :items-per-page="page"
          item-key="id"
          :search="search"
          show-select
          @click:row="showUpdateHelp"
          @update:items-per-page="getPageNum"
        >
          <template v-slot:item.status="{ item }">
            <v-chip :color="statusColor(item)">{{ item.status ? 'Show' : 'Hide'}}</v-chip>
          </template>
          <template v-slot:item.action="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn 
                  text 
                  icon 
                  v-on="on"
                  @click.stop="showUpdateHelp(item)"
                >
                  <v-icon>mdi-pen</v-icon>
                </v-btn>
              </template>
              <span>Update Help</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn 
                  text 
                  icon 
                  v-on="on"
                  @click.stop="deleteHelp(item)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
              <span>Delete Help</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- create a new help dialog -->
    <v-dialog
      v-model="createDlg"
      max-width="1024"
    >
      <v-card
        class="pa-3"
      >
        <v-card-title>
          {{ createDlgTitle }}
        </v-card-title>
        <v-card-text>
          <v-form
            ref="form"
            v-model="valid"
          >
            <v-row no-gutters>
              <v-col cols="12">
                <v-text-field
                  v-model="editItem.title"
                  :rules="[rules.required]"
                  label="Title"
                />
              </v-col>
              <v-col cols="auto">
                <v-select
                  v-model="editItem.status"
                  :items="statusItems"
                  label="Status"
                />
              </v-col>
              <v-col cols="12">
                <vue-editor 
                  v-model="editItem.content"
                  id="editor" 
                  useCustomImageHandler 
                  :editorOptions="editorSettings"
                  @image-added="handleImageAdded" 
                > </vue-editor>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="createDlg = false" color="success" :loading="loading" text>Close</v-btn>
          <v-btn @click="helpActions" color="primary" text  :loading="loading" :disabled="loading || !validForm">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- manage order of helps using DnD -->
    <v-dialog
      v-model="manageDlg"
      max-width="600"
    >
      <v-card
        class=""
      >
        <v-card-title>
          Arrange the order of helps
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col v-if="false">
              <div class="d-flex justify-center font-weight-medium primary--text">Original</div>
              <drop-list 
                :items="copyItems" 
                class="list"
                @reorder="$event.apply(copyItems)" 
                @insert="onInsert1" 
                mode="cut"
              >
                <template v-slot:item="{item, reorder}">
                  <drag 
                    :data="item" 
                    class="item" 
                    :key="item.id"
                    @cut="remove(copyItems, item)"
                  >
                    <v-sheet :key="item.id" class="pa-3" rounded :color="reorder ? 'primary' : 'white'" elevation=1>{{item.title}}</v-sheet>
                  </drag>
                </template>
                <template v-slot:feedback="{data}">
                  <v-sheet class="pa-3" rounded elevation=1 color="primary" :key="data.id">{{data.title}}</v-sheet>
                </template>
              </drop-list>
            </v-col>
            <v-col>
              <div class="d-flex justify-center font-weight-medium success--text">Ordered</div>
              <drop-list
                :items="orderedItems"
                class="list"
                @insert="onInsert2"
                @reorder="$event.apply(orderedItems)"
                mode="cut"
              >
                <template v-slot:item="{item, reorder}">
                  <drag 
                    class="item" 
                    :key="item.id" 
                    :data="item" 
                    @cut="remove(orderedItems, item)"
                  >
                    <v-sheet :key="item.id" class="pa-3" rounded :color="reorder ? 'success' : 'white'" elevation=1>{{item.title}}</v-sheet>
                  </drag>
                </template>
                <template v-slot:feedback="{data}">
                  <v-sheet rounded class="pa-3" elevation=1 color="success" :key="data.id">{{data.title}}</v-sheet>
                </template>
              </drop-list>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="manageDlg = false" color="success" :loading="loading" text>Close</v-btn>
          <v-btn @click="saveOrders" color="primary" text  :loading="loading" :disabled="loading">Save</v-btn>
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
  import { Post, Get, BASE_API } from '../../../../api'
  import { mapState } from 'vuex'
  import { Drag, Drop, DropList } from "vue-easy-dnd";
  import { VueEditor, Quill } from 'vue2-editor'
  import { ImageDrop } from 'quill-image-drop-module'

  Quill.register('modules/imageDrop', ImageDrop)

  export default {
    name: 'AdminHelpBoard',

    components: {
      Drag,
      Drop,
      DropList
    },

    data () {
      return {
        loading: false,
        createDlg: false,
        manageDlg: false,
        search: '',
        valid: true,
        snackbar: false,
        color: 'success',
        message: '',
        editItem: {},
        defaultItem: {
          title: '',
          content: '',
          status: 1
        },
        defaultIndex: -1,
        customToolbar: [["bold", "italic", "underline"], [{ list: "ordered" }, { list: "bullet" }], ["image", "code-block"]],
        editorSettings: {
          modules: {
            imageDrop: true,
          }
        },
        customModulesForEditor: [{ alias: "imageDrop", module: ImageDrop }],
        items: [],
        selectedItems: [],
        copyItems: [],
        orderedItems: [],
        headers: [
          { text: 'Title', value: 'title'},
          { text: 'Status', value: 'status'},
          // { text: 'Content', value: 'content'},
          { text: 'Actions', value: 'action', sortable: false, align: 'center', width: 120 }
        ],
        statusItems: [
          { text: 'Show', value: 1 },
          { text: 'Hide', value: 0 },
        ],
        rules: {
          required: value => {
            return !!value || 'This field is required.'
          }
        },
      }
    },

    computed: {
      ...mapState(['page']),

      createDlgTitle () {
        return this.defaultIndex == -1 ? "Create a New Help" : "Update a Help"
      },
      validForm () {
        return this.valid && this.editItem.content
      }
    },

    methods: {
      onInsert2(event) {
        this.orderedItems.splice(event.index, 0, event.data);
      },

      remove(array, value) {
        let index = array.indexOf(value);
        array.splice(index, 1);
      },

      statusColor (item) {
        return item.status ? 'success' : 'grey lighten-2'
      },

      showSnack(res) {
        this.message = res.message
        this.color = res.status
        this.snackbar = true
      },

      getPageNum (_page) {
        localStorage.setItem('page', _page)
      },

      showCreateDialog () {
        this.editItem = Object.assign({}, this.defaultItem)
        this.defaultIndex = -1
        this.valid = true
        this.createDlg = true
      },

      showManageDlg () {
        this.orderedItems = this.items.filter(item => item.status)
        this.orderedItems.sort((a, b) => a.order - b.order)
        this.manageDlg = true
      },

      async handleImageAdded (file, Editor, cursorLocation, resetUploader) {
        console.log(file, Editor)
        var formData = new FormData();
        formData.append("file", file);

        this.loading = true
        const res = await Post('admin/help/upload_image', formData)
        const url = `${BASE_API}/api/static/${res.url}`
        Editor.insertEmbed(cursorLocation, "image", url);
        resetUploader();
        this.loading = false
      },

      changeView () {
        if (this.mode == 'View') {
          this.mode = 'Edit'
        } else {
          this.mode = 'View'
        }
      },

      async readAllHelps () {
        this.loading = true
        const res = await Get('admin/help/read_all')
        this.items = res.items
        this.showSnack(res)
        this.loading = false
      },

      helpActions () {
        this.$refs.form.validate()
        if (!this.valid) {
          return
        }

        if (this.defaultIndex == -1) {
          this.saveHelp()
        } else {
          this.updateHelp()
        }
      },

      async confirm(msg, callback) {
        await this.$dialog.confirm({
          text: msg,
          title: 'Warning',
          actions: {
            false: 'No',
            true: {
              color: 'red',
              text: 'Yes',
              handle: () => {
                callback()
              }
            }
          }
        })
      },

      async saveHelp () {
        await this.confirm('Do you really want to create this help?', this._saveHelp)
      },

      async _saveHelp () {
        this.loading = true
        const res = await Post('admin/help/save', [this.editItem])
        this.showSnack(res)
        this.loading = false
      },

      async showUpdateHelp (item) {
        this.editItem = Object.assign({}, item)
        this.defaultIndex = this.items.indexOf(item)
        this.valid = true
        this.createDlg = true
      },

      async updateHelp () {
        await this.confirm('Do you really want to update this help?', this._updateHelp)
      },

      async _updateHelp () {
        this.loading = true
        const res = await Post('admin/help/update', this.editItem)
        if (res.status == 'success') {
          Object.assign(this.items[this.defaultIndex], this.editItem)
        }
        this.showSnack(res)
        this.loading = false
      },

      async deleteHelp (item) {
        this.editItem = item
        this.defaultIndex = this.items.indexOf(item)
        await this.confirm('Do you really want to delete this help?', this._deleteHelp)
      },

      async _deleteHelp () {
        this.loading = true
        const res = await Post('admin/help/delete', {id: this.editItem.id})
        if (res.status == 'success') {
          this.items.splice(this.defaultIndex, 1)
          this.createDlg = false
        }
        this.showSnack(res)
        this.loading = false
      },

      async saveOrders () {
        const data = this.orderedItems.map((item, i) => {
          return {
            id: item.id,
            order: i
          }
        })
        this.loading = true
        const res = await Post('admin/help/reorder', data)
        this.showSnack(res)
        this.loading = false
      }
    }
  }
</script>

<style lang="scss" scoped>
.list {
  border: 1px solid black;
  margin: 10px auto;
  width: 100%;
  min-height: 300px;
  border-radius: 4px;

  .item {
    padding: 5px;
    margin: 5px;
    display: flex;
    align-items: center;
    justify-content: start;

    &.feedback {
      border: 2px dashed black;
    }

    &.drag-image {
      transform: translate(-50%, -50%);
    }
  }
}
</style>