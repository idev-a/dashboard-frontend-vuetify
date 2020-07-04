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
		        Slack Board (slack_users)
		        <v-spacer></v-spacer>
		        <v-btn text :href="slackAuthorizeUrl" @click="redirectSlack" :disabled="!importable" target="_blank">
		    		<v-img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" ></v-img>
		    	</v-btn>
	        	<v-btn v-if="false" :loading="loading" :disabled="!importable" @click="runScript" color="success">Import & Run<v-icon  size="16" right dark>mdi-send</v-icon></v-btn>
	        	<v-btn :loading="loading" :disabled="loading"  class="" @click="showCron" color="main">Crons<v-icon  size="16" right dark>mdi-clock-time-eight-outline</v-icon></v-btn>
		    </v-card-title>
		    <v-card-text>
		    	<v-row>
			    	<v-col cols="12" md="4">
			    		<v-text-field
			                v-model="slackClientId"
			                :rules="[rules.required]"
			                prepend-icon="mdi-email"
			                :loading="loading"
			                label="Client Id"
			                hint="Ctrl + Enter to get the list"
			                hide-details="auto"
			                @keyup.ctrl.13="keyDownOnScope"
		              	></v-text-field>
			    	</v-col>
			    	<v-col cols="12" md="4">
			    		<v-text-field
			                v-model="slackClientSecret"
			                :rules="[rules.required]"
			                prepend-icon="mdi-email"
			                :loading="loading"
			                label="Client Secret"
			                hint="Ctrl + Enter to get the list"
			                hide-details="auto"
			                @keyup.ctrl.13="keyDownOnScope"
		              	></v-text-field>
			    	</v-col cols="12" md="4">
			    	<v-col cols="12" md="4">
			    		<v-text-field
			                v-model="company_id"
			                :rules="[rules.required]"
			                prepend-icon="mdi-email"
			                :loading="loading"
			                label="Company Name"
			                hide-details="auto"
		              	></v-text-field>
			    	</v-col cols="12" md="4">
			    </v-row>
		    	<v-row v-if="false">
		    		<v-col>
		    			<v-select
				          v-model="scope"
					  	  chips
					  	  atach
					  	  multiple
				          :items="scopes"
				          label="Select an scope"
				          hint="Select an scope to retrieve user info"
				          readonly
				        ></v-select>
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
          	  	<v-btn :loading="loading" :disabled="loading" @click="readAll" color="main">Read All<v-icon  size="16" right dark>mdi-database-search</v-icon></v-btn>
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
		      	<template v-slot:item.users="{ item }">
                  	<span v-html="beautifyEmails(item.users)"></span>
                </template>
                <template v-slot:item.email="{ item }">
                  	<span v-html="beautifyEmail(item.email)"></span>
                </template>
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

      	<!-- Cron job dialog -->
      	<cron-dialog type="run_slack" interval="daily" />
	</v-container>
</template>

<script>
	import axios from 'axios'
	import { BASE_API } from '../../../api'
	import { downloadCSV, beautifyEmail, beautifyEmails } from '../../../util'
	import { mapState, mapActions } from 'vuex';

	export default {
		name: 'GsuiteBoard',

		components: {
			CronDialog: () => import('../component/CronDialog')
		},

		data () {
			return {
				done: false,
				loading: false,
				email: '',
				slackClientId: ' ',
				slackClientSecret: ' ',
				company_id: '',
				snackbar: false,
				search: '',
		      	message: '',
		      	color: 'success',
		      	scope: ['users:read', 'users.profile:read', 'users:read.email'],
		      	scopes: ['users:read', 'users.profile:read', 'users:read.email', 'admin'],
				errorMessages: {
					email: {
			            required: false,
			            invalid: false,
			        },
				},
				headers: [	
					{
						text: 'Email',
						value: 'email'
					},
					{
						text: 'Username',
						value: 'username'
					},
					{
						text: 'Status',
						value: 'status'
					},
					{
						text: 'Billing Active',
						value: 'billing_active'
					},
					{
						text: 'User Id',
						value: 'userid'
					},
					{
						text: 'Company',
						value: 'company_id'
					},
					{
						text: 'Run At',
						value: 'run_at'
					},
		      	],
	      		selectedItems: [],
		      	items: [],
			 	rules: {
		          required: value => {
		            this.errorMessages.email.required = !!value
		            return this.errorMessages.email.required || 'This field is required.'
		          },
		          email: value => {
		            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		            this.errorMessages.email.invalid = pattern.test(value)
		            return this.errorMessages.email.invalid || 'Invalid e-mail.'
		          },
		      	}
			}
		},

		computed: {
			page () {
		        return Number(localStorage.getItem('page')) || 5
	     	}, 
			importable () {
				return !this.loading && this.slackClientId.trim() && this.slackClientSecret.trim() && this.scope.length
			},
			slackAuthorizeUrl () {
				return `https://slack.com/oauth/authorize?scope=${this.scope.join(',')}&client_id=${this.slackClientId.trim()}&redirect_uri=${BASE_API}/api/callback`
			}
		},

		methods: {
			...mapActions(['showConfirm', 'showCronDialog']),

			beautifyEmail,
			beautifyEmails,

			getPageNum (_page) {
		        localStorage.setItem('page', _page)
		    },

		    showCron () {
      			this.showCronDialog()
      		},
			keyDownOnScope () {
      			if (this.query) {
      				this.runScript()
      			}
      		},

      		async readAll () {
  			 	this.loading = true
  			 	this.selectedItems = []
      			this.items = []
		    	try {
			    	const res = await axios.get(`${BASE_API}/api/admin/slack_users/read`)
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

      		async redirectSlack () {
      			try {
      				const res = await axios({
		      			url: `${BASE_API}/api/admin/slack_init`,
		      			data: { 
		      				SLACK_CLIENT_ID: this.slackClientId.trim(),
		      				SLACK_CLIENT_SECRET: this.slackClientSecret.trim(),
		      				SLACK_COMPANY_ID: this.company_id.trim(),
		      				SLACK_USER_ID: JSON.parse(localStorage.getItem('user')).id,
		      			},
		      			method: 'POST'
		      		})
      			} catch (e) {
      				console.log(e.response)
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
