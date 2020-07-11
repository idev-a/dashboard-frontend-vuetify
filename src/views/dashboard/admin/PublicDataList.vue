<template>
	<v-container
	    id="public-data-run"
	    fluid
	    tag="section"
  	>
	    <v-card
	      class="pa-5"
	    >
	    	<v-card-title>
		        Public Data (Run)
		        <v-spacer></v-spacer>
		        <v-btn  :disabled="loadingBulk" class="mb-2" @click="done=true;getBulkData()" color="main">Check Progress<v-icon  size="16" right dark>mdi-database</v-icon></v-btn>
		        <v-btn :loading="loading" :disabled="loading || !file"  class="mb-2" @click="importCSV" color="main">Import & Run<v-icon  size="16" right dark>mdi-database-import</v-icon></v-btn>
		        <v-spacer></v-spacer>
		        <v-file-input
				    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
				    placeholder="Import CSV file containing domain list"
				    prepend-icon="mdi-database-import"
				    label="CSV file"
				    ref="myfile" 
				    v-model="file"
				    multiple 
			  	></v-file-input>
		    </v-card-title>
			
			<v-spacer></v-spacer>
			<v-card-title>
		        CSV Data 
		        <v-spacer></v-spacer>
		        <v-text-field
	                v-model="csvSearch"
	                append-icon="mdi-magnify"
	                label="Search"
	                class="mb-5"
	                single-line
	                hide-details
              	></v-text-field>
		    </v-card-title>
		    <v-card-text>
	       	 	<v-data-table
		    		v-model="csvData"
			        :loading="loading"
			        :headers="csvHeaders"
			        :items="indexedCSV"
			        :items-per-page="page"
			        item-key="_id"
			        :search="csvSearch"
			        @update:items-per-page="getPageNum"
			        dense
			      > 
			  </v-data-table>
			</v-card-text>

			<v-spacer></v-spacer>
			<v-card-title>
		        Public Data Progress <small>&nbsp;(Click to see its data)</small>
		        <v-spacer></v-spacer>
		        <v-text-field
	                v-model="bulkSearch"
	                append-icon="mdi-magnify"
	                label="Search"
	                class="mb-5"
	                single-line
	                hide-details
              	></v-text-field>
		    </v-card-title>
		    <v-card-text>
	       	 	<v-data-table
			        :loading="loadingBulk"
			        :headers="bulkHeaders"
			        :items="bulkData"
			        :items-per-page="page"
			        item-key="_id"
			        :search="bulkSearch"
			        @update:items-per-page="getPageNum"
			        dense
			        @click:row="showPublicData"
		      	> 
		      	<template v-slot:item.logs="{ item }">
		            <pre>{{ item.logs }}</pre>
		        </template>
			  </v-data-table>
			</v-card-text>
		</v-card>

		<v-card>
			<public-data
	    		v-if="domain"
				title='Business Data'
				category='business'
				:banner="banner"
				:company="domain"
				:key="componentkey"
				:mode="mode"
			>
		  	</public-data>
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
	</v-container>
</template>

<script>
	import axios from 'axios'
	import { BASE_API } from '../../../api'
	import { mapState, mapActions } from 'vuex';

	export default {
		name: 'PublicDataList',

		data: () => ({
			done: false,
			loading: false,
			loadingBulk: false,
			file: null,
			csvSearch: '',
			bulkSearch: '',
		 	snackbar: false,
	      	message: '',
	      	color: 'success',
	      	checkInterval: null,
	      	csvData: [],
	      	csvHeaders: [
	      		{
	      			text: 'Domain',
	      			value: 'domain',
	      		}
	      	],
	      	bulkData: [],
	      	bulkHeaders: [
	      		{
	      			text: 'Domain',
	      			value: 'domain',
	      		},
	      		{
	      			text: 'Status',
	      			value: 'status'
	      		},
	      		{
	      			text: 'Logs',
	      			value: 'logs'
	      		},
	      		{
	      			text: 'Run at',
	      			value: 'run_at'
	      		}
	      	],
	      	domain: '',
	      	banner: false,
	      	mode: true,
		}),

		mounted () {
			const self = this;
			this.checkInterval = setInterval(function() { self.getBulkData() }, 15000)
		},

		beforeDestroy () {
			clearInterval(this.checkInterval)
		},

		components: {
	      PublicData: () => import('../component/PublicData'),
	    },

		computed: {
			...mapState('publicdata', {
	    		componentkey: state => state.componentkey
	    	}),

      		page () {
		        return Number(localStorage.getItem('page')) || 5
	     	}, 

	     	indexedCSV () {
		      return this.csvData.map((item, index) => ({
		        _id: index,
		        ...item
		      }))
		    },
     	},

		methods: {
			showPublicData (item) {
				if (item.status == 'finished') {
					this.domain = item.domain
				} else {
					this.message = `Sorry, Script is still running for this domain, So, display the old data instead.`
	      			this.color = 'failure'
	      			this.snackbar = true
	      			this.domain = item.domain
				}
			},

			getPageNum (_page) {
		        localStorage.setItem('page', _page)
		    },

		    async getBulkData () {
		    	console.log('getBulkData', this.done)
		    	if (!this.done || this.loadingBulk) {
		    		return;
		    	}
		    	this.loadingBulk = true
		    	try {
			    	const res = await axios.get(`${BASE_API}/api/admin/publicdata/check`)
		      		this.bulkData = res.data.data
	      			// this.message = res.data.message
	      			// this.color = res.data.status
		    	} catch(e) {
		    		this.message = 'Something wrong happened on the server.'
	      			// this.snackbar = true
		    	} finally {
	      			this.loadingBulk = false
		    	}
		    },

			async importCSV () {
				let formData = new FormData()
				formData.append('userName', 'CSV');

		        if(this.file){
		        	for (let file of this.file) {
	                	formData.append("file", file, file.name);
	                }

	                this.done = true
                    this.loading = true
                    this.file = null
			    	try {
				    	const res = await axios.post(`${BASE_API}/api/admin/publicdata/run`, formData)
			      		this.csvData = res.data.csv_data
		      			this.message = res.data.message
		      			this.color = res.data.status
			    	} catch(e) {
			    		this.message = 'Something wrong happened on the server.'
			    	} finally {
		      			this.loading = false
		      			this.snackbar = true
			    	}
		        }
			}
		}
	}
</script>