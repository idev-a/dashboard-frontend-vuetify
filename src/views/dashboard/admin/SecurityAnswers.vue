<template>
	<v-container
	    id="meraki-board"
	    fluid
	    tag="section"
	    class="px-0"
  	>
	    <v-card
	      class="ma-0"
	      tile
	      flat
	    >
	    	<v-card-title>
		        Security Answers ({{items.length}})
		        <v-spacer></v-spacer>
		        <v-tooltip bottom>
			      <template v-slot:activator="{ on, attrs }">
		        	<v-btn :loading="loading" v-on="on" v-bind="attrs" :disabled="loading" @click="createModal" class="mr-2"  color="main"><v-icon  size="16"  dark>mdi-plus</v-icon></v-btn>
			      </template>
			      <span>Create Answer</span>
			    </v-tooltip>
			    <v-tooltip bottom>
			      <template v-slot:activator="{ on, attrs }">
		        	<v-btn :loading="loading" v-on="on" v-bind="attrs" :disabled="loading" @click="fetchRisks" class="mr-2"  color="main"><v-icon  size="16"  dark>mdi-refresh</v-icon></v-btn>
			      </template>
			      <span>Refresh</span>
			    </v-tooltip>
        	 	<v-tooltip bottom>
			      <template v-slot:activator="{ on, attrs }">
		        	<v-btn :loading="loading" v-on="on" v-bind="attrs" :disabled="loading || (!items.length && !selectedItems.length)" @click="downloadCSV" color="main"><v-icon  size="16" dark>mdi-download</v-icon></v-btn>
			      </template>
			      <span>Download Data</span>
			    </v-tooltip>
		    </v-card-title>
		    <v-card-title>
              	<v-select
			  	  	v-model="company"
			  	  	:loading="loadingUsers"
			  	  	chips
		          	:items="companies"
		          	label="Select a company"
		          	hint="Display the table data for this company"
		          	@input="fetchRisks"
		        ></v-select>
              	<v-spacer></v-spacer>
		        <v-text-field
	                v-model="search"
	                append-icon="mdi-magnify"
	                label="Search"
	                class="mb-5"
	                single-line
	                hide-details
              	></v-text-field>
          	</v-card-title>
          	<v-card-title>
			    <v-autocomplete
			      :loading="loading"
	              v-model="selectedCategories"
	              :disabled="loading"
	              :items="categories"
	              hide-selected
	              chips
	              attach
	              label="Select a category"
	              multiple
	              @input="changeCategory"
	            >
	              <template v-slot:selection="data">
	                <v-chip
	                  v-bind="data.attrs"
	                  :input-value="data.selected"
	                  close
	                  @click="data.select"
	                  @click:close="remove(data.item)"
	                >
	                  {{ data.item }}
	                </v-chip>
	              </template>
	            </v-autocomplete>
		  	</v-card-title> 
		    <v-card-text>
		    	<v-data-table
		    		v-model="selectedItems"
			        :loading="loading"
			        :headers="headers"
			        :items="items"
			        :items-per-page="page"
			        item-key="_id"
			        :search="search"
			        show-select
		         	single-expand
			        show-expand
			        :expanded.sync="expanded"
			        @click:row="showDetails"
			        @update:items-per-page="getPageNum"
		      	>
		      		<template v-slot:item.action="{ item }">
			          <v-tooltip bottom>
			            <template v-slot:activator="{ on }">
			              <v-btn 
			                text 
			                icon 
			                v-on="on"
			                @click.stop="showDetails(item)"
			              >
			                <v-icon>mdi-application</v-icon>
			              </v-btn>
			            </template>
			            <span>Show Details</span>
			          </v-tooltip>
			          <v-tooltip bottom>
			            <template v-slot:activator="{ on }">
			              <v-btn 
			                text 
			                icon 
			                v-on="on"
			                @click.stop="updateModal(item)"
			              >
			                <v-icon>mdi-pen</v-icon>
			              </v-btn>
			            </template>
			            <span>Update Answer</span>
			          </v-tooltip>
			        </template>
			        <template v-slot:item.data-table-expand="{ item, isExpanded, expand }">
			          <v-btn @click="expand(true)" v-if="item.canExpand && !isExpanded">Expand</v-btn>
			          <v-btn @click="expand(false)" v-if="item.canExpand && isExpanded">close</v-btn>
			        </template>
			        <template v-slot:expanded-item="{ headers }">
			          <td :colspan="headers.length">
			            <div v-if="details">
			            	<question-detail :currentQuestion="currentQuestion"></question-detail>
			            </div>
			          </td>
			        </template>
			  	</v-data-table>
		    </v-card-text>
		</v-card>

		<v-dialog
	      v-model="createDialog"
	      max-width="1024"
	    >
	    	<v-card>
	    		<v-card-title class="display-2">
	    			Answer a question
	    		</v-card-title>
	      		<v-card-text>
	      			<v-form
		              ref="form"
		              v-model="valid"
		            >
	      			 	<v-autocomplete
			          	  	v-if="mode == 'Edit'"
			                v-model="editItem.question_id"
			                label="Question" 
			                item-value="id"
			                item-text="Question"
			                :rules="[rules.required]"
			                :items="questions"
			                required
			                >
			              </v-autocomplete>
		      			<v-textarea
				            v-if="mode == 'Edit'"
			                v-model="editItem.answer"
			                label="Answer" 
			                auto-grow
			                rows="1"
			                :rules="[rules.required]"
			                hide-details="auto"
			                class="mb-3"
			                required
		                >
			            </v-textarea>
				        <v-textarea
				            v-if="mode == 'Edit'"
			                v-model="editItem.notes"
			                label="Notes" 
			                auto-grow
			                rows="1"
			                hide-details="auto"
			                class="mb-3"
		                >
		              	</v-textarea>
		              	<v-textarea
				            v-if="mode == 'Edit'"
			                v-model="editItem.link"
			                label="Link" 
			                auto-grow
			                rows="1"
			                hide-details="auto"
			                class="mb-3"
		                >
		              	</v-textarea>
		              	<v-textarea
				            v-if="mode == 'Edit'"
			                v-model="editItem.recommendation"
			                label="Recommendation" 
			                auto-grow
			                rows="1"
			                hide-details="auto"
			                class="mb-3"
		                >
		              	</v-textarea>
		              	<v-textarea
				            v-if="mode == 'Edit'"
			                v-model="editItem.impact"
			                label="Impact" 
			                auto-grow
			                rows="1"
			                hide-details="auto"
			                class="mb-3"
		                >
		              	</v-textarea>
	              	 	<v-combobox
	              	 	  v-if="mode == 'Edit'"
				          v-model="editItem.tag"
				          label="tag"
				          multiple
				          chips
				        ></v-combobox>
		              	<v-row>
		              		<v-col class="col-auto">
				          	  <v-select
				          	  	v-if="mode == 'Edit'"
				                v-model="editItem.risk_level"
				                :rules="[rules.required]"
				                label="Risk" 
				                chips
				                :items="riskItems"
				                required
				                >
				              </v-select>
				            </v-col>
				            <v-col class="col-auto">
				            	<v-select
				            		v-if="mode == 'Edit'"
							  	  	v-model="editItem.company_id"
							  	  	:loading="loading"
							  	  	chips
						          	:items="companies"
						          	:rules="[rules.required]"
						          	label="Select a company"
						          	required
						        ></v-select>
				            </v-col>
			            </v-row>
		              	<div v-if="mode == 'Edit'" class="body-1 text--secondary mt-4">CIA</div>
		              	<v-chip-group
			              	v-if="mode == 'Edit'"
					        v-model="editItem.cia"
					        column
					        multiple
				      	>
					        <v-chip filter outlined v-for="cia in cias" class="text-capitalize">{{cia}}</v-chip>
				      	</v-chip-group>
				      	<div v-if="mode == 'Edit'" class="body-1 text--secondary mt-4">T1 ~ T11</div>
				      	<v-chip-group
			              	v-if="mode == 'Edit'"
					        v-model="editItem.Ts"
					        column
					        multiple
				      	>
					        <v-chip filter outlined v-for="t in tList">{{t}}</v-chip>
				      	</v-chip-group>
				    </v-form>
	      		</v-card-text>
	      		<v-card-actions>
		          <v-spacer></v-spacer>
		          <v-btn
		            v-if="mode == 'Edit'"
		            color="primary"
		            text
		            :loading="loading"
		            @click="createAnswer"
		          >
		            Create
		          </v-btn>
		          <v-btn
		            color="success"
		            text
		            :loading="loading"
		            @click="createDialog = false"
		          >
		            Close
		          </v-btn>
		        </v-card-actions>
	      	</v-card>
		</v-dialog>

		<v-dialog
	      v-model="updateDialog"
	      max-width="1024"
	    >
	      <v-card>
	      	<v-card-text>
		      	<question-detail v-if="mode == 'View'" :currentQuestion="currentQuestion"></question-detail>
		      	<v-form
	              ref="updateForm"
	              class="mt-4"
	              v-model="updateValid"
	            >
			      	<div v-if="mode == 'Edit'" class="text--secondary text-center display-2">{{ currentQuestion.question }}</div>
			        <v-textarea
			            v-if="mode == 'Edit'"
		                v-model="editItem.answer"
		                label="Answer" 
		                auto-grow
		                rows="1"
		                :rules="[rules.required]"
		                hide-details="auto"
		                class="mb-3"
		                required
	                >
		            </v-textarea>
			        <v-textarea
			            v-if="mode == 'Edit'"
		                v-model="editItem.notes"
		                label="Notes" 
		                auto-grow
		                rows="1"
		                :rules="[rules.required]"
		                hide-details="auto"
		                class="mb-3"
	                >
	              	</v-textarea>
	              	<v-textarea
				            v-if="mode == 'Edit'"
			                v-model="editItem.recommendation"
			                label="Recommendation" 
			                auto-grow
			                rows="1"
			                hide-details="auto"
			                class="mb-3"
		                >
		              	</v-textarea>
		              	<v-textarea
				            v-if="mode == 'Edit'"
			                v-model="editItem.impact"
			                label="Impact" 
			                auto-grow
			                rows="1"
			                hide-details="auto"
			                class="mb-3"
		                >
		              	</v-textarea>
	              	<v-row>
	              		<v-col class="col-auto">
			          	  <v-select
			          	  	v-if="mode == 'Edit'"
			                v-model="editItem.risk_level"
			                label="Risk" 
			                :items="riskItems"
			                >
			              </v-select>
			            </v-col>
		            </v-row>
	              	<div v-if="mode == 'Edit'" class="body-1 text--secondary mt-4">CIA</div>
	              	<v-chip-group
		              	v-if="mode == 'Edit'"
				        v-model="editItem.cia"
				        column
				        multiple
			      	>
				        <v-chip filter outlined v-for="cia in cias" class="text-capitalize">{{cia}}</v-chip>
			      	</v-chip-group>
			      	<div v-if="mode == 'Edit'" class="body-1 text--secondary mt-4">T1 ~ T11</div>
			      	<v-chip-group
		              	v-if="mode == 'Edit'"
				        v-model="editItem.Ts"
				        column
				        multiple
			      	>
				        <v-chip filter outlined v-for="t in tList">{{t}}</v-chip>
			      	</v-chip-group>
			    </v-form>
            </v-card-text>
          	<v-card-actions>
	          <v-spacer></v-spacer>
	          <v-btn
	            v-if="mode == 'Edit'"
	            color="primary"
	            text
	            :loading="loading"
	            @click="updateAnswer"
	          >
	            Update
	          </v-btn>
	          <v-btn
	            v-if="mode == 'Edit'"
	            color="primary"
	            text
	            :loading="loading"
	            @click="deleteAnswer"
	          >
	            Delete
	          </v-btn>
	          <v-btn
	            color="primary"
	            text
	            :loading="loading"
	            @click="toggleMode"
	          >
	            {{ btnLabel }}
	          </v-btn>
	          <v-btn
	            color="success"
	            text
	            :loading="loading"
	            @click="updateDialog = false"
	          >
	            Close
	          </v-btn>
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

		<confirm-dialog @callback="runCallback"></confirm-dialog>
	</v-container>
</template>

<script>
	import axios from 'axios'
	import { BASE_API } from '../../../api'
	import { downloadCSV, addKey, DOMAIN_LIST } from '../../../util'
	import { mapState, mapActions } from 'vuex';

	export default {
		name: 'SecurityAnswers',

		data () {
			return {
				done: false,
				loading: false,
				loadingUsers: false,
				search: '',
				slackClientId: ' ',
				slackClientSecret: ' ',
				snackbar: false,
		      	message: '',
		      	color: 'success',
		      	items: [],
		      	selectedItems: [],
		      	currentQuestion: '',
				details: false,
				expanded: [],
				selectedCategories:[],
				company: '',
				companies: [],
				categories: [
				],
				risksOrigin: [],
				createDialog: false,
				updateDialog: false,
				addDialog: false,
				mode: 'View',
				defaultIndex: -1,
				defaultItem: {
					link: '',
					tag: '',
					risk: 'High',
					cia: [],
					Ts: []
				},
				tags: [],
				valid: true,
				updateValid: true,
				editItem: {},
				callback: null,
		      	headers: [
		      		{
			            text: 'Question',
			            value: 'question',
			            width: 350
		          	},
		          	{
			            text: 'Answer',
			            value: 'answer',
			            width: 400
		          	},
		          	{
			            text: 'Category',
			            value: 'category',
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
			QuestionDetail: () => import('../component/QuestionDetail')
		},

		computed: {
			...mapState('security', ['questions']),
			...mapState(['page', 'riskItems']),
      btnLabel () {
   		if (this.mode == 'Edit') {
				return 'View'
			} else {
				return 'Edit'
			}
   	  },
   	  tList() {
   	  	return ['T1. Software Failures (code, configuration etc.)', 'T2. Cloud Failures (Provider, VHardware, Capacity)', 'T3. Legal Threats (failure to comply, bad contacts)', 'T4. Social Engineering', 'T5. External Unauthorized Access to Information Systems / Data', 'T6. Traffic Monitoring or Interception', 'T7.External Attacker Tampering with Data / Data Destruction', 'T8. Repudiation of transactions and messages', 'T9. Insider Abuse of Privilege', 'T10. Third Party Liability (contractors, third processing)', 'T11. Employee / User Mistakes']
   	  },
   	  cias () {
   	   return ['availability', 'confidentiality', 'integrity']
	   	  },
    },  

		mounted () {
	      this.refreshData()
    	},

		methods: {
			...mapActions(['showConfirm', 'showCronDialog']),

			...mapActions('security', ['fetchQuestions']),

			getPageNum (_page) {
		        localStorage.setItem('page', _page)
	      	},

	      	remove (item) {
	      		this.selectedCategories.map((cat, i) => {
	      			if (cat == item) {
	      				this.selectedCategories.splice(i, 1)
	      			}
	      		})

	      		this.changeCategory(this.selectedCategories)
	      	},

	      	showDetails(item) {
	      		this.expanded = []
		        this.currentQuestion = item
		        this.details = true
		        this.expanded.push(item)
	      	},

	      	toGroups (item, idxs) {
				let group = []
				
	      		idxs.map( (idx, i) => {
	      			if (item[idx]) {
	      				group.push(i)
	      			}
	      		})

	      		return group
	      	},

	      	fromGroups (group, item, idxs) {
	      		group.map(idx => {
	      			const listIdx = idxs[idx]
	      			item[listIdx] = 1
	      		})
	      		return item
	      	},

	      	createModal () {
	      		this.editItem = Object.assign({}, this.defaultItem)
	      		this.mode = 'Edit'
	      		this.valid = true
	      		this.createDialog = true
	      	},

	      	updateModal (item) {
	      		this.currentQuestion = item
	      		this.mode = 'View'
      			this.defaultIndex = this.items.indexOf(item)
      			this.editItem = Object.assign({}, item)
      			this.editItem.cia = this.toGroups(item, this.cias)
      			this.editItem.Ts = this.toGroups(item, this.tList)
      			this.updateValid = true
	      		this.updateDialog = true
	      	},	

	      	toggleMode () {
      			if (this.mode == 'Edit') {
      				this.mode = 'View'
      			} else {
      				this.mode = 'Edit'
      			}
  			},
	      	
	      	changeCategory (data) {
	      		this.selectedItems = []
		        if (data.length) {
		          this.items = this.risksOrigin.filter(risk => data.includes(risk.category))
		        } else {
		          this.items = this.risksOrigin
		        }
	      	},

	      	refreshData () {
	      		this.fetchQuestions()
	      		this.fetchUsers()
	      	},

	      	downloadCSV () {
      			if (this.selectedItems.length) {
      				downloadCSV(this.selectedItems)
      			} else {
      				downloadCSV(this.items)
      			}
      		},

	      	fetchRisks () {
		        const self = this
		        self.loading = true
		        self.selectedItems = []
		        self.selectedCategories = []
		        axios(`${BASE_API}/api/risks/all/${this.company}`, {
		            method: 'GET',
		          })
	            .then(function (res) {
	              self.items = addKey(res.data.risks)
	              self.categories = res.data.categories
	              self.risksOrigin = res.data.risks
	            })
	            .catch(error => {
	              console.log(error)
	            })
	            .finally(() => {
	              self.loading = false
	            })
	      	},

	      	async fetchUsers () {
	      		this.loadingUsers = true
	      		let res = await axios.get(`${BASE_API}/api/users/all`)
	      		res = res.data.users
	      		const companyUsers = res.filter(user => !DOMAIN_LIST.includes(user.email.split('@')[1]))
	      		this.companies = []
	      		const self = this;
	      		companyUsers.map(user => {
	      			if (!self.companies.includes(user.email.split('@')[1])) {
	      				self.companies.push(user.email.split('@')[1]) 
	      			}
	      		})
	      		this.loadingUsers = false
	      	},

	      	runCallback () {
	      		if (this.callback) {
	      			this.callback()
	      		}
	      	},

	      	async createAnswer () {
	      		this.$refs.form.validate()
	      		if (!this.valid) {
	      			return
	      		}
	      		const self = this
	      		await this.$dialog.confirm({
				    text: 'Do you really want to create a new answer?',
				    title: 'Warning',
				    actions: {
				      false: 'No',
				      true: {
				        color: 'red',
				        text: 'Yes',
				        handle: () => {
				          self._createAnswer()
				        }
				      }
				    }
			    })
	      	},

	      	async updateAnswer () {
	      		this.$refs.updateForm.validate()
	      		if (!this.updateValid) {
	      			return
	      		}
	      		const self = this
	      		await this.$dialog.confirm({
				    text: 'Do you really want to update this answer?',
				    title: 'Warning',
				    actions: {
				      false: 'No',
				      true: {
				        color: 'red',
				        text: 'Yes',
				        handle: () => {
				          self._updateAnswer()
				        }
				      }
				    }
			    })
	      	},

	      	async deleteAnswer () {
	      		const self = this
	      		await this.$dialog.confirm({
				    text: 'Do you really want to update this answer?',
				    title: 'Warning',
				    actions: {
				      false: 'No',
				      true: {
				        color: 'red',
				        text: 'Yes',
				        handle: () => {
				          self._deleteAnswer()
				        }
				      }
				    }
			    })
	      	},

	      	async _createAnswer () {
	      		this.showConfirm(false)
      			this.loading = true
		    	try {
		    		this.editItem = this.fromGroups(this.editItem.cia, this.editItem, this.cias)
		    		this.editItem = this.fromGroups(this.editItem.Ts, this.editItem, this.tList)
			    	const data = await axios({
		      			url: `${BASE_API}/api/admin/risks/create`,
		      			data: this.editItem,
		      			method: 'POST'
		      		})
	      			this.message = data.data.message
	      			this.color = data.data.status
		    	} catch(e) {
		    		console.log(e)
		    		this.message = 'Something wrong happened on the server.'
		    	} finally {
	      			this.loading = false
	      			this.snackbar = true
		    	}
	      	},

	      	async _deleteAnswer () {
      			this.loading = true
		    	try {
			    	const data = await axios({
		      			url: `${BASE_API}/api/admin/risks/delete`,
		      			data: this.editItem,
		      			method: 'POST'
		      		})
	      			this.message = data.data.message
	      			this.color = data.data.status
	      			if (data.data.status == 'success') {
	      				this.items.splice(this.defaultIndex, 1)
	      				this.updateDialog = false
	      			}
		    	} catch(e) {
		    		this.message = 'Something wrong happened on the server.'
		    	} finally {
	      			this.loading = false
	      			this.snackbar = true
		    	}
      		},

      		async _updateAnswer () {
      			this.loading = true
		    	try {
		    		this.editItem = this.fromGroups(this.editItem.cia, this.editItem, this.cias)
		    		this.editItem = this.fromGroups(this.editItem.Ts, this.editItem, this.tList)
			    	const data = await axios({
		      			url: `${BASE_API}/api/admin/risks/update`,
		      			data: this.editItem,
		      			method: 'POST'
		      		})
	      			this.message = data.data.message
	      			this.color = data.data.status
	      			if (data.data.status == 'success') {
	      				Object.assign(this.items[this.defaultIndex], this.editItem)
	      				this.currentQuestion = this.editItem
	      			}
		    	} catch(e) {
		    		this.message = 'Something wrong happened on the server.'
		    	} finally {
	      			this.loading = false
	      			this.snackbar = true
		    	}
      		},
		}
	}
</script>