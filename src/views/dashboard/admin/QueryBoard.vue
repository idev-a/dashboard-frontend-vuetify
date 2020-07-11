<template>
	<v-container
	    id="query-board"
	    fluid
	    tag="section"
  	>
	    <v-card
	      class="pa-5"
	    >
	    	<v-card-title>
		        Query Board
		        <v-spacer></v-spacer>
		        <v-switch
			      class="mt-0 mr-3"
			      v-model="findHunter"
			      label="Hunter.io"
			    ></v-switch>
		        <v-switch
			      class="mt-0 mr-3"
			      v-model="toggleEmailNotification"
			      :label="labelEmailNotification"
			    ></v-switch>
		        <v-btn :loading="loading" :disabled="loading || !query" @click="runQuery" color="main">Run Query <v-icon  size="16" right dark>mdi-send</v-icon></v-btn>
	      	</v-card-title>
	    	<v-row
	    	>
	    		<v-col
					cols='12'
					md="3"
	    		>
		            <v-autocomplete
						v-model="table"
						:items="tables"
						label="Tables"
						@input="selectTable"
		            >
		            </v-autocomplete>
		        </v-col>
	    		<v-col
					cols='12'
					md="9"
	    		>
		    		<v-textarea
		                v-model="query"
		                label="SQL Query" 
		                hint="Ctrl + Enter to run the query"
		                rows="2"
		                auto_grow
		                clearable
		                outlined
		                @keyup.ctrl.13="keyDownOnQuery"
		            />
		    	</v-col>
		    </v-row>
			<!-- hunter.io & findemails.com -->
		    <v-card
		    	outlined
		    	tile
				v-if="findHunter"
		    >
		    	<v-card-title class="my-3">
		    		Find prospects from hunter.io & findemails.com
		    		<v-spacer />
		    		<v-btn :loading="loading" :disabled="loading || (!items.length && !selectedItems.length && !website)" @click="_getProspectsFromTable" color="main">Run <v-icon  size="16" right dark>mdi-send</v-icon></v-btn>
		    	</v-card-title>
				<v-card-text>
					<v-textarea
		                v-model="website"
		                label="Multiple websites for hunter.io & findemails.com" 
		                hint="Shift + Enter to run api"
		                placeholder="grove.co"
		                rows="2"
		                auto-grow
		                clearable
		                outlined
		                @keyup.shift.13="keyDownOnAPI"
		            />
				</v-card-text>
			</v-card>
		    
		    <!-- Email Notification -->
		    <v-card 
		    	tile
		    	outlined
				v-if="toggleEmailNotification"
		    >
				<v-card-title
		    		class="my-3"
				>
					Email Notification 
					<v-spacer></v-spacer>
					<v-btn class="main" @click="sendEmailNotification" :loading="loading" :disabled="!notifyPossible">
						Send
			    		<v-icon right>mdi-send</v-icon>
			    	</v-btn>
					<v-btn :loading="loading" :disabled="loading" @click="showCronDialog({dialog: true, type: 'run_email_notification', interval: 'Daily'})" color="main">Crons<v-icon  size="16" right dark>mdi-clock-time-eight-outline</v-icon></v-btn>
				</v-card-title>
				<v-card-text>
					<form 
						ref="form"
						v-model="noti.valid"
					>	
			            <v-textarea
			                v-model="noti.title"
			                label="Title" 
			                hint="Title of the message"
			                rows="1"
			                auto-grow
			                clearable
			                :rules="[rules.required]"
			            />
			            <v-textarea
			                v-model="noti.message"
			                label="Message" 
			                hint="Content of the message"
			                :rules="[rules.required]"
			                auto-grow
			                clearable
			                rows="1"
			            />
			            <v-file-input
						    prepend-icon="mdi-file"
						    label="Attachments"
						    ref="notiAttach" 
						    v-model="noti.attach"
						    :loading="loading"
						    multiple 
					  	></v-file-input>
					  	<v-row>
					  		<v-col cols="12" md="5">
							  	<v-text-field
					                v-model="noti.templateId"
					                label="Template ID" 
					                hint="Sendgrid Template Id"
					                :rules="[rules.required]"
					            />
					        </v-col>
					        <v-col cols="12" md="3">
					            <v-text-field
					                v-model="noti.interval"
					                label="Interval" 
					                hint="Interval of the crontab"
					                :rules="[rules.required]"
					            />
					        </v-col>
					        <v-col cols="12" md="4">
					            <v-text-field
					                v-model="noti.fromEmail"
					                label="Sender Email" 
					                hint="Sender Email"
					                :rules="[rules.required]"
					            />
					        </v-col>
					    </v-row>
				 	</form>
				</v-card-text>
		    </v-card>
	    	<v-card-title>
		    	<v-text-field
	                v-model="search"
	                append-icon="mdi-magnify"
	                label="Search"
	                class="mb-5"
	                single-line
	                hide-details
              	></v-text-field>
              	<v-spacer></v-spacer>
              	
              	<v-btn :loading="loading" :disabled="loading || (!items.length && !selectedItems.length)" @click="downloadCSV" color="main"><v-icon  size="16" dark>mdi-download</v-icon></v-btn>
          	</v-card-title>

          	<v-card-title>
              	<v-autocomplete
			      :loading="loading"
	              v-model="selectedHeaders"
	              :disabled="loading"
	              :items="headers"
	              chips
	              label="Table Columns"
	              multiple
	              item-value="value"
	              item-text="text"
	              hide-selected
      			  @input="updateHeaders"
	            >
	              <template v-slot:selection="data">
	                <v-chip
	                  v-bind="data.attrs"
	                  :input-value="data.selected"
	                  close
	                  @click="data.select"
	                  @click:close="remove(data.item)"
	                >
	                  {{ data.item.text }}
	                </v-chip>
	              </template>
	            </v-autocomplete>
          	</v-card-title>

	    	<v-data-table
	    		v-model="selectedItems"
		        :loading="loading"
		        :headers="filteredHeaders"
		        :items="indexedItems"
		        fixed-header
		        :items-per-page="page"
		        item-key="_id"
		        :search="search"
		        show-select
		        @update:items-per-page="getPageNum"
		      > 
		  	</v-data-table>
		</v-card>
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

      	<v-dialog v-model="modal" max-width="1024">
	      	<v-card>
	       	 	<v-card-title>Propspects</v-card-title>
	      		<v-row class="px-3 pl-8">
	      			<v-col cols="12" md="8">
				    	<v-text-field
			                v-model="prospectSearch"
			                append-icon="mdi-magnify"
			                label="Search"
			                class="mb-5"
			                single-line
			                hide-details
		              	></v-text-field>
	              	</v-col>
	              	<v-col cols="auto">
		              	<v-btn :loading="loading" :disabled="loading || (!prospects.length && !selectedProspects.length)" @click="downloadProspectCSV" color="main">Download CSV <v-icon  size="16" right dark>mdi-download</v-icon></v-btn>
	              	</v-col> 
	          	</v-row>
	          	<v-card-text>
		       	 	<v-data-table
			    		v-model="selectedProspects"
				        :loading="loading"
				        :headers="prospectsHeaders"
				        :items="indexedProspects"
				        :items-per-page="page"
				        item-key="_id"
				        :search="prospectSearch"
				        show-select
				        @update:items-per-page="getPageNum"
				      > 
				  </v-data-table>
				</v-card-text>
		    </v-card>
		</v-dialog>
	</v-container>
</template>

<script>
	import { BASE_API } from '../../../api'
	import { downloadCSV } from '../../../util'
	import axios from 'axios'
	import { mapState, mapActions } from 'vuex';

  	export default {
	    name: 'QueryBoard',

	    data: () => ({
	      loading: false,
	      modal: false,
	      search: '',
	      prospectSearch: '',
	      query: "select * from user where email='ideveloper003@gmail.com'",
	      table: '',
	      tables: [],
	      items: [],
	      selectedItems: [],
	      selectedProspects: [],
	      headers: [],
	      selectedHeaders: [],
	      filteredHeaders: [],
	      prospectsHeaders: [
	      	{
	      		text: 'Domain',
	      		value: 'domain'
	      	},
	      	{
	      		text: 'First Name',
	      		value: 'first_name'
	      	},
	      	{
	      		text: 'Last Name',
	      		value: 'last_name'
	      	},
	      	{
	      		text: 'Email',
	      		value: 'email'
	      	},
	      	{
	      		text: 'Title',
	      		value: 'title'
	      	},
	      	{
	      		text: 'Source',
	      		value: 'source'
	      	},
	      	{
	      		text: 'Run at',
	      		value: 'run_at'
	      	}
	      ],
	      website: '',
	      prospects: [],
	      snackbar: false,
	      message: '',
	      color: 'success',
	      findHunter: false,
	      toggleEmailNotification: false,
	      noti: {
	      	valid: true,
	      	templateId: 'd-403a831fec3b4dcd9da4018a3d534a84',
	      	fromEmail: 'tips@revampcybercecurity.com',
      	 	title: '',
	      	message: '',
      	 	interval: '0 9 * * *',
	      	attach: null,
	      },
	      rules: {
	          required: value => {
	            return !!value || 'This field is required.'
	          },
	      }
	 	}),

 	 	mounted () {
 	 		this.fetchTables()
      	},

      	computed: {
      		...mapState(['page', 'companyId']),

	     	indexedItems () {
		      return this.items.map((item, index) => ({
		        _id: index,
		        ...item
		      }))
		    },
		    indexedProspects () {
		    	return this.prospects.map((item, index) => ({
			        _id: index,
			        ...item
		      	}))
		    },
		    labelEmailNotification () {
		    	return this.toggleEmailNotification ? 'Email Notification' : 'Email Notification'
		    },
		    notifyPossible () {
		    	return this.noti.title && this.noti.message && !this.loading && this.query
		    }
      	},

      	methods: {
      		...mapActions(['showCronDialog']),

      		cleanWebsite (string) {
      			return string.trim().replace('https://', '').replace('http://', '').replace('www.', '').split('?')[0]
      		},

      		remove (item) {
      			this.selectedHeaders.map((header, i) => {
	      			if (header == item.value) {
	      				this.selectedHeaders.splice(i, 1)
	      			}
	      		})

	      		this.updateHeaders(this.selectedHeaders)
      		},

      		async getProspects (websites) {
      			this.loading = true
      			this.selectedProspects = []
		    	try {
			    	const res = await axios({
		      			url: `${BASE_API}/api/admin/getprospects/`,
		      			data: { items: websites },
		      			method: 'POST',
		      			timeout: 10000000000
		      		})
		      		this.prospects = res.data.prospects
	      			this.message = res.data.message
	      			this.color = res.data.status
	      			this.modal = true
		    	} catch(e) {
		    		this.message = 'Something wrong happened on the server.'
		    	} finally {
	      			this.loading = false
	      			this.snackbar = true
		    	}
      		},

      		_getProspectsFromTable () {
      			let websites = []
      			this.selectedItems.map(item => {
      				if (item['website']) {
      					if (this.cleanWebsite(item['website'])) {
		      				websites.push(this.cleanWebsite(item['website']))
      					}
	      				
      				}
      			})
      			if (this.website) {
      				this.website.trim().split('\n').map(item => {
      					if (this.cleanWebsite(item)) {
		      				websites.push(this.cleanWebsite(item))
      					}
      				})
      			}
      			this.getProspects(websites)
      			// console.log(websites)
      		},

      		downloadCSV () {
      			if (this.selectedItems.length) {
      				downloadCSV(this.selectedItems)
      			} else {
      				downloadCSV(this.items)
      			}
      		},

      		downloadProspectCSV () {
      			if (this.selectedProspects.length) {
      				downloadCSV(this.selectedProspects)
      			} else {
      				downloadCSV(this.prospects)
      			}
      		},

      		keyDownOnAPI () {
      			if (this.website) {
      				let websites = []
      				this.website.trim().split('\n').map(item => {
	      				websites.push(this.cleanWebsite(item))
      				})
      				this.getProspects(websites)
      			}
      		},

      		keyDownOnQuery () {
      			if (this.query) {
      				this.runQuery()
      			}
      		},

      		updateHeaders (data) {
      			if (data.length) {
      				this.filteredHeaders = this.headers.filter(header => data.includes(header.value))
      			} else {
      				this.filteredHeaders = this.headers
      			}
      		},

      		getPageNum (_page) {
		        localStorage.setItem('page', _page)
		    },

		    selectTable () {
		    	this.query = `SELECT * FROM \`${this.table}\``
		    },

		    async fetchTables () {
		    	try {
			    	const res = await axios({
		      			url: `${BASE_API}/api/admin/query/tables`,
		      			method: 'GET'
		      		})
		      		this.tables = res.data.items
			    } catch (e) {
			    	console.log(e.response)
			    }
		    },

		    async runQuery () {
		    	this.loading = true
		    	this.headers = []
		    	this.selectedItems = []
		    	this.selectedHeaders = []
		    	this.filteredHeaders = []

		    	try {
			    	const data = await axios({
		      			url: `${BASE_API}/api/admin/query`,
		      			data: { query: this.query },
		      			method: 'POST'
		      		})
		      		data.data.headers.map(header => {
		      			this.headers.push({
		      				text: header.toUpperCase(),
		      				value: header
		      			})
		      		})
		      		this.filteredHeaders = this.headers
		      		this.items = data.data.items
	      			this.message = data.data.message
	      			this.color = data.data.status
		    	} catch(e) {
		    		this.message = 'Something wrong happened on the server.'
		    	} finally {
	      			this.loading = false
	      			this.snackbar = true
		    	}
		    },

		    // Email Notification
		    async sendEmailNotification () {
		  //   	this.$refs.form && this.$refs.form.validate()
				// if (!this.notiValid) {
				// 	return
				// }

				let formData = new FormData()
				if (this.noti.attach) {
		        	for (let file of this.noti.attach) {
	                	formData.append("files", file, file.name);
	                }
				}

                const data = {
                	title: this.noti.title,
                	message: this.noti.message,
                	template_id: this.noti.templateId,
                	from_email: this.noti.fromEmail,
                	interval: this.noti.interval,
                	query: this.query,
                	company_id: this.companyId,
                	user_id: JSON.parse(localStorage.getItem('user')).id
                }

                console.log(data)

                const json = JSON.stringify(data);
				const blob = new Blob([json], {
				  type: 'application/json'
				});

				formData.append("document", blob);

                this.loading = true
                this.file = null
		    	try {
			    	const res = await axios.post(`${BASE_API}/api/admin/email_notification/run`, formData)
	      			this.message = res.data.message
	      			this.color = res.data.status
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