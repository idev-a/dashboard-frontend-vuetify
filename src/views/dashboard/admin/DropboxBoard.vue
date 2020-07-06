<template>
	<v-container
	    id="dropbox-board"
	    fluid
	    tag="section"
  	>
	    <v-card
	      class="pa-5"
	    >
	    	<v-card-title>
	    		<div>
			        <div>Dropbox Board (dropbox_users)</div>
			        <v-subheader>Find Dropbox Users</v-subheader>
			    </div>
			    <v-spacer></v-spacer>
		        <v-btn class="main" @click="authDropbox" :loading="loading" :disabled="!importable">
		    		Authenticate
		    		<v-icon right>mdi-send</v-icon>
		    	</v-btn>
		    	<v-btn :loading="loading"  :disabled="loading" @click="showCronDialog({dialog: true, type: 'run_dropbox', interval: 'Daily'})" color="main">Crons<v-icon  size="16" right dark>mdi-clock-time-eight-outline</v-icon></v-btn>
		    </v-card-title>
		    <v-card-text>
		    	<v-row>
			    	<v-col cols='12' md="8">
			    		<v-textarea
			                v-model="access_token"
			                :rules="[rules.required]"
			                prepend-icon="mdi-email"
			                :loading="loading"
			                label="Acess token"
			                auto-grow
                        	rows="1"
			                hide-details="auto"
		              	></v-textarea>
			    	</v-col>
			    	<v-col cols='12' md="3">
			    		<v-textarea
			                v-model="company_id"
			                :rules="[rules.required]"
			                prepend-icon="mdi-email"
			                :loading="loading"
			                label="Company Name"
			                auto-grow
	                    	rows="1"
			                hide-details="auto"
		              	></v-textarea>
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
	          	  	<v-btn :loading="loading" :disabled="loading" class="mr-2" @click="readAll" color="main">Read All<v-icon  size="16" right dark>mdi-database-search</v-icon></v-btn>
	          	 	<v-btn :loading="loading" :disabled="loading || (!items.length && !selectedItems.length)" @click="downloadCSV" color="main">Download <v-icon  size="16" right dark>mdi-download</v-icon></v-btn>
	          	</v-card-title>
			    <v-data-table
		    		v-model="selectedItems"
			        :loading="loading"
			        :headers="headers"
			        :items="items"
			        :items-per-page="page"
			        item-key="id"
			        :search="search"
			        show-select
			        @update:items-per-page="getPageNum"
			      > 
	                <template v-slot:item.email="{ item }">
	                  	<span v-html="beautifyEmails(item.email)"></span>
	                </template>
			  	</v-data-table>
		    </v-card-text>
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
	import { downloadCSV, beautifyEmails } from '../../../util'
	import { mapState, mapActions } from 'vuex';

	export default {
		name: 'DropboxBoard',

		data () {
			return {
				loading: false,
				access_token: 'ZcleRNk2k4AAAAAAAArSgBy0XndfW9vszf0WGF9RaifVAeOgNE77P3fZjkFyA94Y',
				company_id: 'grove.co',
				snackbar: false,
		      	message: '',
		      	color: 'success',
		      	search: '',
		      	selectedItems: [],
		      	items: [],
		      	headers: [
		      		{
		      			text: 'Email',
		      			value: 'email'
		      		},
		      		{
		      			text: 'Display Name',
		      			value: 'display_name'
		      		},
		      		{
		      			text: 'Status',
		      			value: 'status'
		      		},
		      		{
		      			text: 'Group Name',
		      			value: 'group_name'
		      		},
		      		{
		      			text: 'Membership Type',
		      			value: 'membership_type'
		      		},
		      		{
		      			text: 'Company',
		      			value: 'company_id'
		      		},
		      		{
		      			text: 'Run',
		      			value: 'run_at'
		      		}
		      	],
				rules: {
		          required: value => {
		            return !!value || 'This field is required.'
		          },
		      	}
	      	}
	    },

	    computed: {
	    	...mapState(['page', 'userId']),

			importable () {
				return !this.loading && this.access_token.trim() && this.company_id.trim()
			},
		},

		methods: {
			...mapActions(['showCronDialog']),

			beautifyEmails,

			downloadCSV () {
      			if (this.selectedItems.length) {
      				downloadCSV(this.selectedItems)
      			} else {
      				downloadCSV(this.items)
      			}
      		},
      		
      		getPageNum (_page) {
		        localStorage.setItem('page', _page)
		    },

		    async readAll () {
		    	var url = `${BASE_API}/api/admin/dropbox_users/read`
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

      		async authDropbox () {
      			this.loading = true
      			try {
      				const res = await axios({
		      			url: `${BASE_API}/api/admin/dropbox/run`,
		      			data: { 
		      				access_token: this.access_token.trim(),
		      				user_id: this.userId,
		      				company_id: this.company_id.trim()
		      			},
		      			method: 'POST'
		      		})
		      		this.message = res.data.message
		      		this.color = res.data.status
      			} catch (e) {
      				console.log(e.response)
      			} finally {
      				this.loading = false
      				this.snackbar = true
      			}
      		}
		}
	}
</script>