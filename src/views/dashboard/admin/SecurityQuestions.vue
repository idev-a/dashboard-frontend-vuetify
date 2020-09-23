<template>
  <v-container
      id="meraki-board"
      fluid
      tag="section"
      class="px-0"
    >
      <v-card
        tile
        flat
        class="ma-0"
      >
        <v-card-title>
            Security Questions ({{ questions.length }})
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn :loading="loading" v-on="on" v-bind="attrs" :disabled="loading" @click="showCreate" class="mr-2"  color="main"><v-icon  size="16"  dark>mdi-plus</v-icon></v-btn>
            </template>
            <span>Create Question</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn :loading="loading" v-on="on" v-bind="attrs" :disabled="loading" @click="fetchQuestions" class="mr-2"  color="main"><v-icon  size="16"  dark>mdi-database</v-icon></v-btn>
            </template>
            <span>Read Questions</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn :loading="loading" v-on="on" v-bind="attrs" :disabled="loading || (!questions.length && !selectedItems.length)" @click="downloadCSV" class="mr-2" color="main"><v-icon  size="16" dark>mdi-download</v-icon></v-btn>
            </template>
            <span>Download Questions</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn :loading="loading" v-on="on" v-bind="attrs" :disabled="loading" @click="uploadDialog=true" color="main"><v-icon  size="16" dark>mdi-upload</v-icon></v-btn>
            </template>
            <span>Upload Answers Sheet</span>
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
          <v-select
            v-model="category"
            :items="categories"
            label="Category"
            multiple
            chips
            dense
            deletable-chips
          >
            <template v-slot:prepend-item>
              <v-list-item
                ripple
                @click="toggleSelect"
              >
                <v-list-item-action>
                  <v-icon :color="category.length > 0 ? 'indigo darken-4' : ''">{{ icon }}</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Select All</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider class="mt-2"></v-divider>
            </template>
          </v-select>
        </v-card-title>
        <v-card-text>
          <v-data-table
            v-model="selectedItems"
              :loading="loading"
              :headers="headers"
              :items="filteredQuestions"
              :items-per-page="page"
              item-key="id"
              :search="search"
              show-select
              @click:row="showEdit"
              @update:items-per-page="getPageNum"
            >
              <template v-slot:item.action="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn 
                      text 
                      icon 
                      v-on="on"
                      @click.stop="showEdit(item)"
                    >
                      <v-icon>mdi-pen</v-icon>
                    </v-btn>
                  </template>
                  <span>Edit Question</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn 
                      text 
                      icon 
                      v-on="on"
                      @click.stop="_deleteQuestion(item)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                  <span>Delete Question</span>
                </v-tooltip>
              </template>
          </v-data-table>
        </v-card-text>
    </v-card>
  
    <!-- Crud dialog -->
    <v-dialog
      v-model="dialog"
      @click:outside="showDialog(false)"
      max-width="1024"
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-form
            ref="form"
            class="mt-4"
            v-model="valid"
          >
            <v-combobox
              v-model="editedItem.question"
              label="Question" 
              item-value="id"
              item-text="question"
              :rules="[rules.required]"
              :items="questions"
              clear-icon
              required
              >
            </v-combobox>
            <v-textarea
              v-model="editedItem.description"
              label="Description" 
              auto-grow
              rows="2"
              :rules="[rules.required]"
              hide-details="auto"
              class="mb-3"
            >
            </v-textarea>
            <v-textarea
              v-model="editedItem.mapping"
              label="Mapping (Public Data only)" 
              auto-grow
              rows="1"
              hide-details="auto"
              class="mb-3"
            >
            </v-textarea>
            <v-combobox
              v-model="editedItem.category"
              :items="categories"
              :rules="[rules.required]"
              label="Category"
              chips
              deletable-chips
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            v-if="editedIndex === -1"
            color="primary"
            text
            :loading="loading"
            :disabled="loading || !valid"
            @click="_createQuestion"
          >
            Create
          </v-btn>
          <v-btn
            v-if="editedIndex !== -1"
            color="primary"
            text
            :disabled="loading || !valid"
            :loading="loading"
            @click="_updateQuestion"
          >
            Update
          </v-btn>
          <v-btn
            v-if="editedIndex !== -1"
            color="danger"
            text
            :loading="loading"
            @click="_deleteQuestion(editedItem)"
          >
            Delete
          </v-btn>
          <v-btn
            color="success"
            text
            :loading="loading"
            @click="showDialog(false)"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Upload Answers Dialog -->
    <v-dialog
      v-model="uploadDialog"
      width=600
    >
      <v-card>
        <v-card-title>
          Upload the answers sheet
        </v-card-title>
        <v-card-text>
          <v-form
            ref="uploadForm"
            v-model="uploadValid"
          >
            <v-row>
              <v-col cols="12" md="6">
                <v-autocomplete
                  v-model="company_id"
                  :items="companies"
                  label="Select company" 
                  auto-grow
                  chips
                  rows="2"
                  :rules="[rules.required]"
                  hide-details="auto"
                  class="mb-3"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-file-input
                  ref="myfile" 
                  v-model="file"
                  accept=".csv"
                  placeholder="Import answers sheet"
                  prepend-icon="mdi-database-import"
                  label="Answer sheet"
                  :rules="[rules.required]"
                  :loading="loading"
                ></v-file-input>
              </v-col>
            </v-row>
            <v-card-actions>
              <v-spacer />
              <v-btn text @click="uploadDialog = false" :loading="loading" :disabled="loading">Close</v-btn>
              <v-btn color="success" text @click="uploadAnswerSheet" :loading="loading" :disabled="loading || !uploadValid">Upload</v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { downloadCSV, addKey, DOMAIN_LIST } from '../../../util'
import { getCompaniesUsers, BASE_API, Post, Get } from '../../../api'
import { mapState, mapActions } from 'vuex';

export default {
  name: 'SecurityQuestions',

  data () {
    return {
      loading: false,
      done: false,
      search: '',
      valid: true,
      uploadDialog: false,
      uploadValid: true,
      file: null,
      category: [],
      defaultIndex: -1,
      editedIndex: -1,
      editedItem: {},
      defaultItem: {},
      selectedItems: [],
      expanded: [],
      company_id: '',
      companies: [],
      headers: [
        {
          text: 'Question',
          value: 'question',
          width: 350
        },
        {
          text: 'Description',
          value: 'description',
          width: 300
        },
        {
          text: 'Category',
          value: 'category',
          width: 180
        },
        { text: 'Actions', value: 'action', sortable: false, width: 120, align: 'center' }
      ],
      rules: {
        required: value => {
          return !!value || 'This field is required.'
        },
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        },
      }
    }
  },
  components: {
    ConfirmDialog: () => import('../component/Confirm'),
  },

  computed: {
    ...mapState('security', ['questions', 'dialog']),
    ...mapState(['page']),

    formTitle () {
      return this.editedIndex === -1 ? 'New Question' : 'Edit Question'
    },

    btnLabel () {
      if (this.mode == 'Edit') {
        return 'View'
      } else {
        return 'Edit'
      }
    },
    filteredQuestions () {
      if (this.category.length) {
        return this.questions.filter(que => this.category.includes(que.category))
      } else {
        return this.questions
      }
    },
    categories () {
      const cats = []
      if (this.questions.length) {
        this.questions.map(item => {
          if (!cats.includes(item.category)) {
            cats.push(item.category)
          }
        })
      } 
      return cats
    },
    selectedAllCategories () {
      return this.category.length == this.categories.length
    },
    selectedSomeCategories () {
      return this.category.length > 0 && !this.selectedAllCategories
    },
    icon () {
      if (this.selectedAllCategories) return 'mdi-close-box'
      if (this.selectedSomeCategories) return 'mdi-minus-box'
      return 'mdi-checkbox-blank-outline'
    },
  },

  async mounted () {
    this.fetchQuestions()
    this.companies = await getCompaniesUsers()
  },

  methods: {
    ...mapActions(['showConfirm', 'showCronDialog']),

    ...mapActions('security', ['fetchQuestions', 'createQuestion', 'updateQuestion', 'deleteQuestion', 'setLoading', 'showDialog', 'showSnackbar']),

    getPageNum (_page) {
      localStorage.setItem('page', _page)
    },

    toggleSelect () {
      this.$nextTick(() => {
        if (this.selectedAllCategories) {
          this.category = []
        } else {
          this.category = this.categories.slice()
        }
      })
    },

    showEdit(item) {
      this.editedIndex = this.questions.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.showDialog()
    },

    showCreate() {
      this.editedItem = Object.assign({}, this.defaultItem)
      this.editedIndex = -1
      this.showDialog()
    },

    async _createQuestion () {
      this.$refs.form.validate()
      if (!this.valid) {
        return
      }
      const self = this
      await this.$dialog.confirm({
      text: 'Do you really want to create a new question?',
      title: 'Warning',
      actions: {
        false: 'No',
        true: {
          color: 'red',
          text: 'Yes',
          handle: () => {
            self.createQuestion({
              editedItem: self.editedItem,
            })
          }
        }
      }
    })
    },

    async _updateQuestion () {
      this.$refs.form.validate()
      if (!this.valid) {
        return
      }
      const self = this
      await this.$dialog.confirm({
        text: 'Do you really want to delete this question?',
        title: 'Warning',
        actions: {
          false: 'No',
          true: {
            color: 'red',
            text: 'Yes',
            handle: () => {
              self.updateQuestion({
                editedItem: this.editedItem,
                editedIndex: self.editedIndex
              })
            }
          }
        }
      })
    },

    async _deleteQuestion (item) {
      const self = this
      await this.$dialog.confirm({
        text: 'Do you really want to delete this question?',
        title: 'Warning',
        actions: {
          false: 'No',
          true: {
            color: 'red',
            text: 'Yes',
            handle: () => {
              self.deleteQuestion({
                editedItem: item,
              })
            }
          }
        }
      })
    },

    downloadCSV () {
      let modifiedQues = []
      if (this.selectedItems.length) {
        modifiedQues = this.selectedItems
      } else {
        modifiedQues = this.filteredQuestions
      }
      const _items = modifiedQues.map(ques => {
        ques.answer = ''
        ques.link = ''
        ques.tag = ''
        ques.impact = ''
        ques.recommendation = ''
        ques.risk_level = 'high'
        ques.cia = ''
        ques.threats = ''
        ques['notes'] = ''
        return ques
      })
      downloadCSV(_items)
    },

    async uploadAnswerSheet () {
      let formData = new FormData()

      formData.append("file", this.file, this.file.name);

      this.loading = true
      const payload = {}
      try {
        const res = await Post(`admin/risks/answers/upload/${this.company_id}`, formData)
        payload.message = res.message
        payload.status = res.status
      } catch(e) {
        this.message = 'Something wrong happened on the server.'
      } finally {
        this.loading = false
        this.showSnackbar(payload)  
        this.file = null
      }
    }
  }
}
</script>