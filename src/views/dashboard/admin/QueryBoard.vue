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
		        <v-btn :loading="loading" :disabled="loading || !query" @click="runQuery" color="success">Run Query <v-icon  size="16" right dark>mdi-send</v-icon></v-btn>
	      	</v-card-title>
	    	<v-row
	    	>
	    		<v-col
					cols='12'
	    		>
		    		<v-textarea
		                v-model="query"
		                label="SQL Query" 
		                hint="Ctrl + Enter to run the query"
		                rows="3"
		                outlined
		                @keyup.ctrl.13="keyDownOnQuery"
		            />
		    	</v-col>
		    </v-row>
		    <v-spacer></v-spacer>
		    <v-row
	    	>
	    		<v-col
					cols='12'
	    		>
		    		<v-textarea
		                v-model="website"
		                label="Website for hunter.io & findemails.com" 
		                hint="Shift + Enter to run api"
		                rows="3"
		                outlined
		                @keyup.shift.13="keyDownOnAPI"
		            />
		    	</v-col>
		    </v-row>
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
              	<v-btn :loading="loading" :disabled="loading || (!items.length && !selectedItems.length && !website)" @click="_getProspectsFromTable" color="success">Hunter & FindEmails <v-icon  size="16" right dark>mdi-send</v-icon></v-btn>
              	<v-btn :loading="loading" :disabled="loading || (!items.length && !selectedItems.length)" @click="downloadCSV" color="success">Download <v-icon  size="16" right dark>mdi-download</v-icon></v-btn>
          	</v-card-title>
              <v-card-title>
              	<v-select
              		:loading="loading"
              		label="Table Columns"
					:items="headers"
					multiple
					attach
          			small-chips
          			v-model="selectedHeaders"
          			@input="updateHeaders"
              	>
          		 	<template v-slot:selection="{ attrs, item, parent, selected }">
				        <v-chip
				          v-if="item === Object(item)"
				          v-bind="attrs"
				          :color="`${item.color} lighten-3`"
				          :input-value="selected"
				          label
				          small
				        >
				          <span class="pr-2">
				            {{ item.text }}
				          </span>
				          <v-icon
				            small
				            @click="parent.selectItem(item)"
				          >mdi-close</v-icon>
				        </v-chip>
				      </template>
	            </v-select>
          	</v-card-title>
	    	<v-data-table
	    		v-model="selectedItems"
		        :loading="loading"
		        :headers="filteredHeaders"
		        :items="indexedItems"
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
      		<v-btn
		        dark
		        text
		        @click="snackbar = false"
	      	>
		        Close
	      	</v-btn>
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
		              	<v-btn :loading="loading" :disabled="loading || (!prospects.length && !selectedProspects.length)" @click="downloadProspectCSV" color="success">Download CSV <v-icon  size="16" right dark>mdi-download</v-icon></v-btn>
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

  	export default {
	    name: 'QueryBoard',

	    data: () => ({
	      loading: false,
	      modal: false,
	      search: '',
	      prospectSearch: '',
	      query: '',
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
	      color: 'success'
	 	}),

 	 	mounted () {
      	},

      	computed: {
      		page () {
		        return Number(localStorage.getItem('page')) || 5
	     	}, 
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
		    }
      	},

      	methods: {
      		cleanWebsite (string) {
      			return string.trim().replace('https://', '').replace('http://', '').replace('www.', '').split('?')[0]
      		},

      		async getProspects (websites) {
      			this.loading = true
      			this.selectedProspects = []
		    	try {
			    	const data = await axios({
		      			url: `${BASE_API}/api/admin/getprospects`,
		      			data: { items: websites },
		      			method: 'POST'
		      		})
		      		this.prospects = data.data.prospects
	      			this.message = data.data.message
	      			this.color = data.data.status
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
      				this.filteredHeaders = []
      			}
      		},

      		getPageNum (_page) {
		        localStorage.setItem('page', _page)
		    },

		    async runQuery () {
		    	this.loading = true
		    	this.headers = []
		    	this.selectedItems = []

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
		      		this.filteredHeaders = this.selectedHeaders = this.headers
		      		this.items = data.data.items
	      			this.message = data.data.message
	      			this.color = data.data.status
		    	} catch(e) {
		    		this.message = 'Something wrong happened on the server.'
		    	} finally {
	      			this.loading = false
	      			this.snackbar = true
		    	}
		    }
      	}
	}
</script>