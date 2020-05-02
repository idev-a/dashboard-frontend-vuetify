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
		        Meraki Board
		        <v-spacer></v-spacer>
		        <v-btn :loading="loading" :disabled="loading || !apiKey || !orgId" @click="getDevices" color="success">Get Devices <v-icon  size="16" right dark>mdi-send</v-icon></v-btn>
	      	</v-card-title>
	      	<v-card-text>
	      		<v-row
		    	>
		    		<v-col
						cols='12'
						md="6"
		    		>
						<v-text-field
			              v-model="apiKey"
			              :loading="loading"
			              hide-details="auto"
			              class="mb-2"
			              label="Please enter api key"
			              prepend-icon="mdi-key"
			            />
			    	</v-col>
			    	<v-col
						cols='12'
						md="6"
		    		>
						<v-text-field
			              v-model="orgId"
			              :loading="loading"
			              hide-details="auto"
			              class="mb-2"
			              label="Please enter organization id"
			              prepend-icon="mdi-identifier"
			            />
			    	</v-col>
			    </v-row>
	      	</v-card-text>
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
              	<v-tooltip top>
		            <template v-slot:activator="{ on }">
	              		<v-btn :loading="loading" :disabled="loading || !orgId" @click="readAll" color="success">Read All<v-icon  size="16" right dark>mdi-database-search</v-icon></v-btn>
	              	</template>
	              	<span>Read Meraki Devices Data from Database</span>
              	</v-tooltip>
	            <v-tooltip bottom>
		            <template v-slot:activator="{ on }">
		              	<v-btn :loading="loading" :disabled="loading || (!items.length && !selectedItems.length)" @click="populateData" color="success">Populate <v-icon  size="16" right dark>mdi-database-export</v-icon></v-btn>
	              	</template>
	              	<span>Populate Data from API into Database</span>
		        </v-tooltip>
		        <v-tooltip bottom>
		            <template v-slot:activator="{ on }">
              			<v-btn :loading="loading" :disabled="loading || (!items.length && !selectedItems.length)" @click="downloadCSV" color="success">Download <v-icon  size="16" right dark>mdi-download</v-icon></v-btn>
              		</template>
              		<span>Download Data as CSV</span>
              	</v-tooltip>
          	</v-card-title>
	      	<v-data-table
	    		v-model="selectedItems"
		        :loading="loading"
		        :headers="headers"
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
  	</v-container>
</template>
<script>
	import { BASE_API } from '../../../api'
	import { downloadCSV } from '../../../util'
	import axios from 'axios'

  	export default {
	    name: 'MerakiBoard',

	    data: () => ({
	      loading: false,
	      modal: false,
	      tooltip: true,
	      search: '',
	      orgId: '',
	      apiKey: '',
	      headers: [
	      ],
	      selectedItems: [
	      ],
	      items: [
	      ],
	      snackbar: false,
	      message: '',
	      color: 'success'
      	}),

      	computed: {
      		page () {
		        return Number(localStorage.getItem('page')) || 5
	     	}, 

      		indexedItems () {
		      return this.items.map((item, index) => ({
		        _id: index,
		        ...item,
		      	org_id: this.orgId,
		      	run_at: this.$moment().format('YYYY-MM-DD HH:mm:ss')
		      }))
		    },
      	},

      	methods: {
      		getPageNum (_page) {
		        localStorage.setItem('page', _page)
		    },

		    parseHeader (items) {
				if (items.length) {
		      		Object.keys(items[0]).map(val => {
		      			this.headers.push({
		      				text: val.toUpperCase(),
		      				value: val
		      			})
		      		})
		      		this.headers.push({
		      			text: 'ORG ID',
		      			value: 'org_id'
		      		})
		      		this.headers.push({
		      			text: 'Run At',
		      			value: 'run_at'
		      		})
	      		}
		    },

      		async getDevices () {
      			this.loading = true
		    	try {
			    	const res = await axios({
		      			url: `${BASE_API}/api/admin/meraki/devices`,
		      			data: { apiKey: this.apiKey, orgId: this.orgId },
		      			method: 'POST'
		      		})
		      		this.items = res.data.devices
		      		this.parseHeader(this.items)
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

      		downloadCSV () {
      			if (this.selectedItems.length) {
      				downloadCSV(this.selectedItems)
      			} else {
      				downloadCSV(this.items)
      			}
      		},

      		async populateData () {
      			this.loading = true
      			let data = this.indexedItems
      			if (this.selectedItems.length) {
      				data = this.selectedItems
      			}
		    	try {
			    	const res = await axios({
		      			url: `${BASE_API}/api/admin/meraki/devices/populate`,
		      			data: { data },
		      			method: 'POST'
		      		})
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

      		async readAll () {
      			this.loading = true
		    	try {
			    	const res = await axios({
		      			url: `${BASE_API}/api/admin/meraki/devices/read`,
		      			data: { org_id: this.orgId },
		      			method: 'POST'
		      		})
		      		this.items = res.data.devices
		      		this.parseHeader(this.items)
	      			this.message = res.data.message
	      			this.color = res.data.status
	      			this.modal = true
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