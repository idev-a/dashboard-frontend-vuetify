<template>
	<div>
		<v-card-title>
	        <div class="font-weight-light body">Manage <b>users</b> table</div>
		    <v-spacer></v-spacer>
		</v-card-title>
		<v-card-title>
			<div class="d-flex flex-wrap align-center">
		    	<v-text-field
	                v-model="search"
	                append-icon="mdi-magnify"
	                label="Search"
	                class="mb-5"
	                single-line
	                hide-details
              	></v-text-field>
		    </div>
          	<v-spacer></v-spacer>
          	<div class="d-flex flex-wrap align-center">
          		<v-select
		          v-model="companyId"
		          :rules="[rules.required]"
			  	  chips
			  	  small
		          :items="companiesAndAll"
		          @input="readUsers"
		          class="mr-3"
		          label="Select a company"
		          hint="Select a company you want to manage"
		        ></v-select>
          		<v-tooltip bottom>
          			<template v-slot:activator="{ on, attrs }">
	              		<v-btn :loading="loading" v-on="on" v-bind="attrs" :disabled="loading" class="mr-2" @click="readUsers" color="main">
		              		<v-icon  size="16" dark>mdi-database-search</v-icon>
		              	</v-btn>
	              	</template>
	              	<span>Read All</span>
              	</v-tooltip>
              	<v-tooltip bottom>
          			<template v-slot:activator="{ on, attrs }">
	              		<v-btn :loading="loading" :disabled="loading || (!items.length && !selectedItems.length)" v-on="on" v-bind="attrs" class="mr-2" @click="downloadCSV" color="main">
		              		<v-icon  size="16" dark>mdi-download</v-icon>
		              	</v-btn>
	              	</template>
	              	<span>Download</span>
              	</v-tooltip>
              	<v-tooltip bottom v-if="false">
			      <template v-slot:activator="{ on, attrs }">
		        	<v-btn :loading="loading" v-on="on" v-bind="attrs" :disabled="loading" @click="createModal" class="mr-2" color="main"><v-icon  size="16"  dark>mdi-plus</v-icon></v-btn>
			      </template>
			      <span>Create Answer</span>
			    </v-tooltip>
            </div>
      	</v-card-title>
      	<v-data-table
    		v-model="selectedItems"
	        :loading="loading"
	        :headers="userHeaders"
	        :items="items"
	        :items-per-page="page"
	        item-key="id"
	        :search="search"
	        show-select
	        @update:items-per-page="getPageNum"
	      > 
	      	<template v-slot:item.action="{ item }">
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
	            <span>Edit</span>
	          </v-tooltip>
	      	</template>
            <template v-slot:item.email="{ item }">
              	<span v-html="beautifyEmails(item.email)"></span>
            </template>
	  	</v-data-table>

	  	<v-dialog
	      v-model="updateDialog"
	      max-width="1024"
	    >
	      <v-card>
	      	<v-card-title>{{ updateTitle }}</v-card-title>
	      	<v-card-text>
		      	<user-detail v-if="mode == 'View'" :currentUser="currentUser" />
		      	<v-form
		      	  v-if="mode == 'Edit'"
	              ref="updateForm"
	              class="mt-4"
	              v-model="updateValid"
	            >
			      	<div class="text--secondary text-center display-2">{{ currentUser.question }}</div>
			      	<v-row >
			      		<v-col cols="12" md="6">
					        <v-text-field
				                v-model="editItem.email"
				                label="Email" 
				                :rules="[rules.required, rules.email]"
				                hide-details="auto"
				                class="mb-3"
			                >
				            </v-text-field>
				        </v-col>
				        <v-col cols="12" md="6">
					        <v-text-field
				                v-model="editItem.firstname_lastname"
				                label="Full Name" 
				                :rules="[rules.required]"
				                hide-details="auto"
				                class="mb-3"
			                >
			              	</v-text-field>
		              	</v-col>
	              	</v-row>
	              	<v-textarea
		                v-model="editItem.department"
		                label="Department" 
		                auto-grow
		                rows="1"
		                hide-details="auto"
		                class="mb-3"
		                required
	                >
		            </v-textarea>
	              	<v-row>
	              		<v-col class="col-auto">
			          	  <v-select
			                v-model="editItem.privileged_account"
			                label="Privileged" 
			                :items="YES_NO"
			                >
			              </v-select>
			            </v-col>
			            <v-col class="col-auto">
			          	  <v-select
			                v-model="editItem.email_not_active"
			                label="Active" 
			                :items="YES_NO"
			                >
			              </v-select>
			            </v-col>
			            <v-col class="col-auto">
			          	  <v-select
			                v-model="editItem.risk_level"
			                label="Individual Risk" 
			                :items="RISK"
			                >
			              </v-select>
			            </v-col>
		            </v-row>
		            <v-row>
			      		<v-col cols="12" md="6">
			              	<v-text-field
				                v-model="editItem.user_type"
				                label="Type" 
				                hide-details="auto"
				                class="mb-3"
			                >
			              	</v-text-field>
		              	</v-col>
		              	<v-col cols="12" md="6">
			              	<v-text-field
				                v-model="editItem.location"
				                label="Location" 
				                hide-details="auto"
				                class="mb-3"
			                >
			              	</v-text-field>
		              	</v-col>
	              	</v-row>
	              	<v-row>
			      		<v-col cols="12" md="6">
			              	<v-text-field
				                v-model="editItem.job_title"
				                label="Job Title" 
				                hide-details="auto"
				                class="mb-3"
			                >
			              	</v-text-field>
			            </v-col>
			            <v-col cols="12" md="6">
			              	<v-textarea
				                v-model="editItem.observations"
				                label="Observations" 
				                auto-grow
				                rows="1"
				                hide-details="auto"
				                class="mb-3"
				                required
			                >
				            </v-textarea>
				        </v-col>
				    </v-row>
				    <v-row>
			      		<v-col cols="12" md="8">
				            <v-textarea
				                v-model="editItem.notes"
				                label="Notes" 
				                auto-grow
				                rows="1"
				                hide-details="auto"
				                class="mb-3"
				                required
			                >
				            </v-textarea>
				        </v-col>
				        <v-col cols="12" md="4">
				            <v-select
					          v-model="editItem.company_id"
					          :rules="[rules.required]"
						  	  chips
						  	  small
					          :items="companies"
					          class="mb-3"
					          label="Company"
					        ></v-select>
					    </v-col>
					</v-row>
			    </v-form>
            </v-card-text>
          	<v-card-actions>
	          <v-spacer></v-spacer>
	          <v-btn
	            v-if="mode == 'Edit'"
	            color="primary"
	            text
	            :loading="loading"
	            @click="updateUser"
	          >
	            Update
	          </v-btn>
	          <v-btn
	            v-if="mode == 'Edit'"
	            color="primary"
	            text
	            :loading="loading"
	            @click="deleteUser"
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
	</div>
</template>

<script>
	import axios from 'axios'
	import { BASE_API } from '../../../../api'
	import { downloadCSV, DOMAIN_LIST, beautifyEmails } from '../../../../util'
	import { mapState, mapActions } from 'vuex';

	export default {
		name: 'AdminUsers',

		props: {
			companies: {
				type: Array
			}
		},

		data () {
			return {
				done: false,
				createValid: true,
				updateValid: true,
				loading: false,
				snackbar: false,
		      	message: '',
		      	color: 'success',
		      	search: '',
		      	companyId: 'All',
		      	selectedItems: [],
		      	items: [],
		      	updateDialog: false,
		      	currentUser: {},
		      	editItem: {},
		      	defaultIndex: -1,
				defaultItem: {
				},
		      	mode: 'View',
		      	YES_NO: [
		      		{
		      			text: 'Yes',
		      			value: 1
		      		},
		      		{
		      			text: 'No',
		      			value: 0
		      		}
		      	],
		      	RISK: [
		      		{
		      			text: 'High',
		      			value: 'high'
		      		},
		      		{
		      			text: 'Medium',
		      			value: 'medium'
		      		},
		      		{
		      			text: 'Low',
		      			value: 'low'
		      		},
		      	],
		      	userHeaders: [
		      		{
			          text: 'Full Name',
			          value: 'firstname_lastname',
			        },
			        {
			          text: 'Email',
			          value: 'email',
			        },
			        {
			          text: 'Job Title',
			          value: 'job_title',
			        },
			        {
			          text: 'Company',
			          value: 'company_id',
			        },
			        { text: 'Actions', value: 'action', sortable: false },
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
	      UserDetail: () => import('../../component/UserDetail')
	    },

		computed: {
      		...mapState(['page']),

      		companiesAndAll() {
      			return [
	      			'All',
	      			...this.companies
	      		]
      		},

      		btnLabel () {
	     		if (this.mode == 'Edit') {
	  				return 'View'
	  			} else {
	  				return 'Edit'
	  			}
     	  	},

     	  	updateTitle () {
     	  		if (this.mode == 'Edit') {
	  				return 'Edit User'
	  			} else {
	  				return 'View User'
	  			}
     	  	}
		},

		async mounted() {
		},

		methods: {
			beautifyEmails,

			getPageNum (_page) {
		        localStorage.setItem('page', _page)
		    },

		    async readAll (url) {
      			this.loading = true
  			 	this.selectedItems = []
      			this.items = []
		    	try {
			    	const res = await axios.get(url)
		      		this.items = res.data.items
	      			this.message = res.data.message
	      			this.color = res.data.status
		    	} catch(e) {
		    		this.message = 'Something wrong happened on the server.'
		    	} finally {
	      			this.loading = false
	      			this.snackbar = true
		    	}
      		},

      		async readUsers () {
      			this.readAll(`${BASE_API}/api/admin/users/read/${this.companyId}`)
      		},

	      	createModal () {

	      	},

	      	async updateUser () {
	      		this.$refs.updateForm.validate()
	      		if (!this.updateValid) {
	      			return
	      		}
	      		const self = this
	      		await this.$dialog.confirm({
				    text: 'Do you really want to update this user?',
				    title: 'Warning',
				    actions: {
				      false: 'No',
				      true: {
				        color: 'red',
				        text: 'Yes',
				        handle: () => {
				          self._updateUser()
				        }
				      }
				    }
			    })
	      	},

	      	async deleteUser () {
	      		const self = this
	      		await this.$dialog.confirm({
				    text: 'Do you really want to delete this user?',
				    title: 'Warning',
				    actions: {
				      false: 'No',
				      true: {
				        color: 'red',
				        text: 'Yes',
				        handle: () => {
				          self._deleteUser()
				        }
				      }
				    }
			    })
	      	},

	      	async _updateUser () {
	      		this.loading = true
		    	try {
			    	const data = await axios({
		      			url: `${BASE_API}/api/admin/users_groups/users/update`,
		      			data: this.editItem,
		      			method: 'POST'
		      		})
	      			this.message = data.data.message
	      			this.color = data.data.status
	      			if (data.data.status == 'success') {
	      				Object.assign(this.items[this.defaultIndex], this.editItem)
	      				this.currentUser = this.editItem
	      			}
		    	} catch(e) {
		    		this.message = 'Something wrong happened on the server.'
		    	} finally {
	      			this.loading = false
	      			this.snackbar = true
		    	}
	      	},

	      	async _deleteUser () {
	      		this.loading = true
		    	try {
			    	const data = await axios({
		      			url: `${BASE_API}/api/admin/users_groups/users/remove`,
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

	      	toggleMode () {
      			if (this.mode == 'Edit') {
      				this.mode = 'View'
      			} else {
      				this.mode = 'Edit'
      			}
  			},

  			updateModal (item) {
	      		this.currentUser = item
	      		this.mode = 'View'
      			this.defaultIndex = this.items.indexOf(item)
      			this.editItem = Object.assign({}, item)
      			this.updateValid = true
	      		this.updateDialog = true
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