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
		        Slack Board
		        <v-spacer></v-spacer>
		        <v-btn text :href="slackAuthorizeUrl" @click="redirectSlack" :disabled="!importable" target="_blank">
		    		<v-img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" ></v-img>
		    	</v-btn>
	        	<v-btn v-if="false" :loading="loading" :disabled="!importable" @click="runScript" color="success">Import & Run<v-icon  size="16" right dark>mdi-send</v-icon></v-btn>
		    </v-card-title>
		    <v-card-text>
		    	<v-row>
			    	<v-col>
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
			    	<v-col>
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
			    	</v-col>
			    </v-row>
		    	<v-row>
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
	import axios from 'axios'
	import { BASE_API } from '../../../api'
	import { mapState, mapActions } from 'vuex';

	export default {
		name: 'GsuiteBoard',

		data () {
			return {
				done: false,
				loading: false,
				email: '',
				slackClientId: ' ',
				slackClientSecret: ' ',
				snackbar: false,
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
			importable () {
				return !this.loading && this.slackClientId.trim() && this.slackClientSecret.trim() && this.scope.length
			},
			slackAuthorizeUrl () {
				return `https://slack.com/oauth/authorize?scope=${this.scope.join(',')}&client_id=${this.slackClientId.trim()}&redirect_uri=${BASE_API}/api/callback`
			}
		},

		methods: {
			keyDownOnScope () {
      			if (this.query) {
      				this.runScript()
      			}
      		},

      		runScript () {

      		},

      		async redirectSlack () {
      			try {
      				const res = await axios({
		      			url: `${BASE_API}/api/admin/slack_init`,
		      			data: { SLACK_CLIENT_ID: this.slackClientId.trim(), SLACK_CLIENT_SECRET: this.slackClientSecret.trim() },
		      			method: 'POST'
		      		})
      			} catch (e) {
      				console.log(e.response)
      			}
      		}
      	}
  	}
</script>
