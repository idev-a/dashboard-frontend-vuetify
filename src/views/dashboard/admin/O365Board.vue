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
		        Office365 Board (office_365_users)
		        <v-spacer></v-spacer>
		        <v-btn class="success" :loading="loading" @click="redirectO365" :disabled="!importable">
		    		Authenticate
		    		<v-icon right>mdi-send</v-icon>
		    	</v-btn>
		    	<v-btn :loading="loading" :disabled="loading"  class="" @click="showCron" color="success">CronJobs<v-icon  size="16" right dark>mdi-send</v-icon></v-btn>
		    </v-card-title>
		    <v-card-text>
		    	<v-row>
			    	<v-col>
			    		<v-text-field
			                v-model="o365ClientId"
			                :rules="[rules.required]"
			                prepend-icon="mdi-email"
			                :loading="loading"
			                label="Client Id"
			                hide-details="auto"
		              	></v-text-field>
			    	</v-col>
			    	<v-col>
			    		<v-text-field
			                v-model="o365ClientSecret"
			                :rules="[rules.required]"
			                prepend-icon="mdi-email"
			                :loading="loading"
			                label="Client Secret"
			                hide-details="auto"
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

		<cron-dialog type="Office 365"  interval="Daily" />
	</v-container>
</template>

<script>
	import axios from 'axios'
	import { BASE_API } from '../../../api'
	import { mapState, mapActions } from 'vuex';

	export default {
		name: 'GsuiteBoard',

		components: {
			CronDialog: () => import('../component/CronDialog')
		},

		data () {
			return {
				loading: false,
				o365ClientId: '9a186811-ad73-4f95-aa9f-3ffbfd0a8cd5',
				o365ClientSecret: '__6xnxlfg.LsY2NRYH6KNo.5Lv1y-Im8t~',
				scope: ["User.Read", "User.ReadBasic.All", "Directory.Read.All", "Directory.AccessAsUser.All", "User.Read.All", "Contacts.Read", "Contacts.Read.Shared", "User.ManageIdentities.All", "email", "Policy.ReadWrite.AuthenticationMethod"],
		      	scopes: ["User.Read", "User.ReadBasic.All", "Directory.Read.All", "Directory.AccessAsUser.All", "User.Read.All", "Contacts.Read", "Contacts.Read.Shared", "User.ManageIdentities.All", "email", "Policy.ReadWrite.AuthenticationMethod"],
				rules: {
		          required: value => {
		            return !!value || 'This field is required.'
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
				return !this.loading && this.o365ClientId.trim() && this.o365ClientSecret.trim() && this.scope.length
			},
			o365Url () {
				return `https://login.microsoftonline.com/common?scope=${this.scope.join(',')}&client_id=${this.o365ClientId.trim()}&redirect_uri=${BASE_API}/api/o365Callback&response_type=code`
			}
		},

		methods: {
			...mapActions(['showCronDialog']),

      		async redirectO365 () {
      			this.loading = true
	      		try {
	  				const res = await axios({
		      			url: `${BASE_API}/api/o365/buildurl`,
		      			data: { 
		      				O365_CLIENT_ID: this.o365ClientId.trim(),
		      				O365_CLIENT_SECRET: this.o365ClientSecret.trim(),
		      				scope: this.scope.join(','),
		      				user_id: JSON.parse(localStorage.getItem('user')).id
		      			},
		      			method: 'POST'
		      		})
	      			if (res.status == 200) {
	      				window.open(res.data.auth_url, '_blank')
	      			}
	      		} catch (e) {
	      			console.log(e.response)
	      		} finally {
	      			this.loading = false
		    	}
      		},
      		showCron () {
      			this.showCronDialog()
      		}
		}
	}
</script>