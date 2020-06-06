<template>
	<div>
		<confirm-dialog @callback="runCallback"></confirm-dialog>

		<v-dialog
			:value="cronDialog"
			@click:outside="hideDialog"
	  	>
	  		<v-card
	  		>
	  			<div class="d-flex flex-row align-center justify-center pa-4 ">
	  				<div class="display-1 ml-4">Cron Jobs ({{ type }} - {{ interval }})</div>
	  				<v-spacer></v-spacer>
	  				<v-text-field
			          v-model="searchCron"
			          append-icon="mdi-magnify"
			          label="Search"
			          class="mb-3 mr-3"
			          single-line
			          hide-details
			        ></v-text-field>
	  				<v-btn :loading="loading" :disabled="loading" @click="readAllCrons" icon><v-icon color="success" size="24">mdi-refresh</v-icon></v-btn>
	  				<v-btn :loading="loading" @click="resumeCrons" :disabled="selectedCrons.length == 0 || loading" icon><v-icon color="success" size="24">mdi-play</v-icon></v-btn>
	  				<v-btn :loading="loading" @click="pauseCrons" :disabled="selectedCrons.length == 0 || loading" icon><v-icon color="success" size="24">mdi-pause</v-icon></v-btn>
	  				<v-btn :loading="loading" @click="deleteCrons" :disabled="selectedCrons.length == 0 || loading" icon><v-icon color="primary" size="24">mdi-delete</v-icon></v-btn>
	  				<v-btn class="ml-3" @click="hideDialog" icon><v-icon>mdi-close</v-icon></v-btn>
	  			</div>
	  			<v-card-text>
		      		<v-data-table
			    		v-model="selectedCrons"
				        :loading="loading"
				        :headers="cronHeaders"
				        :items="crons"
				        :items-per-page="page"
				        item-key="id"
				        :search="searchCron"
				        show-select
				        @update:items-per-page="getPageNum"
			      	> 
				      	<template v-slot:item.data="{ item }">
		                  	<span v-html="beautifyEmails(item.data.emails)"></span>
		                </template>
		                <template v-slot:item.run_at="{ item }">
		                  	<span v-html="beautifyDateTime(item.run_at)"></span>
		                </template>
		                <template v-slot:item.nextRun="{ item }">
		                  	<span v-html="showNextRun(item)"></span>
		                </template>
				  	</v-data-table>
			  	</v-card-text>
		  	</v-card>
	  	</v-dialog>
	</div>	
</template>

<script>
import axios from 'axios'
import { BASE_API } from '../../../api'
import { mapState, mapActions } from 'vuex';
import { downloadCSV, beautifyEmail, beautifyEmails, beautifyDateTime } from '../../../util'
export default {
	name: 'CronDialog',

	props: {
		type: {
			type: String,
		},
		interval: {
			type: String,
			default: 'Weekly'
		}
	},

	components: {
		ConfirmDialog: () => import('../component/Confirm')
	},

	computed: {
		...mapState(['cronDialog']),

  		page () {
	        return Number(localStorage.getItem('page')) || 5
     	}, 
    },

	data () {
		return {
			loading: false,
			searchCron: '',
			callback: null,
			selectedCrons: [],
	      	crons: [],
	      	cronHeaders: [
      			{
	      			text: 'Job',
	      			value: 'job_id'
	      		},
	      		{
	      			text: 'Status',
	      			value: 'status'
	      		},
	      		{
	      			text: 'Run At',
	      			value: 'run_at'
	      		},
	      		{
	      			text: 'Trigger',
	      			value: 'interval'
	      		},
	      		{
	      			text: 'Next Run',
	      			value: 'nextRun'
	      		},
	      	],
		}
	},

	mounted () {
		if (this.type == 'GSuite Drive') {
			this.cronHeaders.unshift({
      			text: 'Emails',
      			value: 'data'
      		})
		}
		this.readAllCrons()
	},

	methods: {
		...mapActions(['showConfirm', 'showCronDialog']),

		beautifyEmails,
		beautifyDateTime,

		getPageNum (_page) {
	        localStorage.setItem('page', _page)
	    },

		async readAllCrons () {
		 	this.loading = true
		 	this.selectedCrons = []
  			this.crons = []
	    	try {
		    	const res = await axios.post(`${BASE_API}/api/admin/cron/read`, { type: this.type})
	      		this.crons = res.data.crons
      			this.message = res.data.message
      			this.color = res.data.status
	    	} catch(e) {
	    		this.message = 'Something wrong happened on the server.'
	    	} finally {
      			this.loading = false
      			this.snackbar = true
	    	}
  		},

  		pauseCrons () {
  			this.callback = this._pauseCrons
  			this.showConfirm()
  		},

  		async _pauseCrons () {
		 	const ids = this.selectedCrons.map(cron => cron.job_id)
		 	this.loading = true
		 	let data = { 
		 		ids,
		 		type: this.type 
		 	}
		 	console.log(data)
	    	try {
		    	const res = await axios.post(`${BASE_API}/api/admin/cron/pause`, data)
		    	this.selectedCrons = []
		    	this.crons.map(cron => {
		    		if (data.ids.includes(cron.job_id)) {
		    			cron.status = 'paused'
		    		}
		    	})
      			this.message = res.data.message
      			this.color = res.data.status

	    	} catch(e) {
	    		this.message = 'Something wrong happened on the server.'
	    	} finally {
      			this.loading = false
      			this.snackbar = true
	    	}
  		},

  		resumeCrons () {
  			this.callback = this._resumeCrons
  			this.showConfirm()
  		},

  		async _resumeCrons () {
			 	this.loading = true
			 	const ids = this.selectedCrons.map(cron => cron.job_id)
			 	let data = { 
			 		ids,
			 		type: this.type
			 	}
	    	try {
		    	const res = await axios.post(`${BASE_API}/api/admin/cron/resume`, data)
		    	this.selectedCrons = []
		    	this.crons.map(cron => {
		    		if (data.ids.includes(cron.job_id)) {
		    			cron.status = 'active'
		    		}
		    	})
		    	console.log(this.crons)
      			this.message = res.data.message
      			this.color = res.data.status
	    	} catch(e) {
	    		this.message = 'Something wrong happened on the server.'
	    	} finally {
      			this.loading = false
      			this.snackbar = true
	    	}
  		},

  		deleteCrons () {
  			this.callback = this._deleteCrons
  			this.showConfirm()
  		},

  		async _deleteCrons () {
			 	this.loading = true
			 	const ids = this.selectedCrons.map(cron => cron.job_id)
			 	let data = { 
			 		ids,
			 		type: this.type
			 	}
	    	try {
		    	const res = await axios.post(`${BASE_API}/api/admin/cron/delete`, data)
		    	this.crons = this.crons.filter(cron => !data.ids.includes(cron.job_id))
		    	this.selectedCrons = []
      			this.message = res.data.message
      			this.color = res.data.status
	    	} catch(e) {
	    		this.message = 'Something wrong happened on the server.'
	    	} finally {
      			this.loading = false
      			this.snackbar = true
	    	}
  		},

  		showNextRun (item) {
  			let nextRun = '-'
  			if (item.status == 'done' || item.status == 'active') {
  				if (this.type == 'GSuite Drive') {
	  				nextRun = this.$moment().add(1, 'weeks').startOf('week').format('YYYY MMM DD')
  				} else if (this.type == 'Office 365') {
  					if (item.interval == '0 5 * * *') {
		  				nextRun = this.$moment().add(1, 'day').format('YYYY MMM DD') + ' 05:00'
  					} else {
		  				nextRun = this.$moment().add(1, 'day').format('YYYY MMM DD') + ' 20:00'
  					}
  				}
  			}

  			return nextRun
  		},

  		hideDialog () {
  			this.showCronDialog(false)
  		},

  		runCallback () {
  			if (this.callback) {
  				this.callback()
  			}
  		}
	}
}
</script>