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
		        Security Questions ({{ items.length }})
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
		        	<v-btn :loading="loading" v-on="on" v-bind="attrs" :disabled="loading || (!items.length && !selectedItems.length)" @click="downloadCSV" color="main"><v-icon  size="16" dark>mdi-download</v-icon></v-btn>
			      </template>
			      <span>Download Data</span>
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
			                @click.stop="deleteQuestion(item)"
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
		                v-model="editedItem.Question"
		                label="Question" 
		                item-value="id"
		                item-text="Question"
		                :rules="[rules.required]"
		                :items="items"
		                required
		                >
		              </v-combobox>
	              	<v-textarea
		                v-model="editedItem.Description"
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
			          v-model="editedItem.Category"
			          :items="categories"
			          :rules="[rules.required]"
			          label="Category"
			          chips
			        ></v-combobox>
	         	</v-form>
	      	</v-card-text>
	      	<v-card-actions>
	          <v-spacer></v-spacer>
	          <v-btn
	            v-if="editedIndex === -1"
	            color="primary"
	            text
	            :loading="loading"
	            @click="createQuestion"
	          >
	            Create
	          </v-btn>
	          <v-btn
	            v-if="editedIndex !== -1"
	            color="primary"
	            text
	            :loading="loading"
	            @click="editQuestion"
	          >
	            Update
	          </v-btn>
	          <v-btn
	            v-if="editedIndex !== -1"
	            color="danger"
	            text
	            :loading="loading"
	            @click="deleteQuestion"
	          >
	            Delete
	          </v-btn>
	          <v-btn
	            color="success"
	            text
	            :loading="loading"
	            @click="dialog = false"
	          >
	            Close
	          </v-btn>
	        </v-card-actions>
	      </v-card>
	    </v-dialog>

		<!-- confirm dialog -->
		<confirm-dialog @callback="runCallback"></confirm-dialog>
	</v-container>
</template>

<script>
import axios from 'axios'
import { BASE_API } from '../../../api'
import { downloadCSV, addKey, DOMAIN_LIST } from '../../../util'
import { mapState, mapActions } from 'vuex';

export default {
	name: 'SecurityQuestions',

	data () {
		return {
			done: false,
			loading: false,
			search: '',
			valid: true,
			dialog: false,
			defaultIndex: -1,
			editedIndex: -1,
			editedItem: {},
			defaultItem: {},
			items: [],
	      	selectedItems: [],
	      	expanded: [],
			headers: [
	      		{
		            text: 'Question',
		            value: 'Question',
		            width: 350
	          	},
	          	{
		            text: 'Description',
		            value: 'Description',
		            width: 300
	          	},
	          	{
		            text: 'Category',
		            value: 'Category',
		            width: 180
	          	},
	          	{ text: 'Actions', value: 'action', sortable: false }
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
      page () {
        return Number(localStorage.getItem('page')) || 5
      }, 

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
 	  categories () {
 	  	const cats = []
 	  	if (this.items.length) {
 	  		this.items.map(item => {
 	  			if (!cats.includes(item)) {
 	  				cats.push(item.Category)
 	  			}
 	  		})
 	  	} 
 	  	return cats
 	  }
 	},

 	mounted () {
 		this.fetchQuestions()
 	},

 	methods: {
		...mapActions(['showConfirm', 'showCronDialog']),

		getPageNum (_page) {
	        localStorage.setItem('page', _page)
      	},

      	showEdit(item) {
      		this.editedIndex = this.items.indexOf(item)
	        this.editedItem = Object.assign({}, item)
	        this.dialog = true
      	},

      	showCreate() {
      	  this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
          this.dialog = true
      	},

      	createQuestion () {
      		this.$refs.form.validate()
      		if (!this.valid) {
      			return
      		}
      		this.callback = this._createQuestion
      		this.showConfirm()
      	},

      	editQuestion (item) {
      		this.$refs.form.validate()
      		if (!this.valid) {
      			return
      		}
      		this.callback = this._editQuestion
      		this.showConfirm()
      	},

      	deleteQuestion (item) {
      		this.editedItem = item
      		this.callback = this._deleteQuestion
      		this.showConfirm()
      	},

      	async _createQuestion () {
          	this.showConfirm(false)
  			this.loading = true
	    	try {
		    	const data = await axios({
	      			url: `${BASE_API}/api/admin/risks/questions/create`,
	      			data: this.editedItem,
	      			method: 'POST'
	      		})
      			this.message = data.data.message
      			this.color = data.data.status
      			this.dialog = false
	    	} catch(e) {
	    		this.message = 'Something wrong happened on the server.'
	    	} finally {
      			this.loading = false
      			this.snackbar = true
	    	}
        },

      	async _editQuestion () {
      		this.showConfirm(false)
  			this.loading = true
	    	try {
		    	const data = await axios({
	      			url: `${BASE_API}/api/admin/risks/questions/update`,
	      			data: this.editedItem,
	      			method: 'POST'
	      		})
      			this.message = data.data.message
      			this.color = data.data.status
      			this.dialog = false
	    	} catch(e) {
	    		this.message = 'Something wrong happened on the server.'
	    	} finally {
      			this.loading = false
      			this.snackbar = true
	    	}
      	},

      	async _deleteQuestion () {
      		this.showConfirm(false)
  			this.loading = true
	    	try {
		    	const data = await axios({
	      			url: `${BASE_API}/api/admin/risks/questions/delete`,
	      			data: this.editedItem,
	      			method: 'POST'
	      		})
      			this.message = data.data.message
      			this.color = data.data.status
      			if (data.data.status == 'success') {
      				this.items.splice(this.defaultIndex, 1)
      				this.dialog = false
      			}
	    	} catch(e) {
	    		this.message = 'Something wrong happened on the server.'
	    	} finally {
      			this.loading = false
      			this.snackbar = true
	    	}
      	},

      	runCallback () {
      		if (this.callback) {
      			this.callback()
      		}
      	},

      	async fetchQuestions () {
  			this.loading = true
  			try {
		    	const data = await axios.get(`${BASE_API}/api/admin/risks/questions`)
		    	this.items = data.data.questions
	    	} catch(e) {
	    		console.log(e.response)
	    	} finally {
      			this.loading = false
	    	}
  		},

  		downloadCSV () {
  			if (this.selectedItems.length) {
  				downloadCSV(this.selectedItems)
  			} else {
  				downloadCSV(this.items)
  			}
  		},
    }
}
</script>