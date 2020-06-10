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
		        Alassian Board (atlassian_users)
		        <v-spacer></v-spacer>
		        <v-btn class="success" @click="authZoom" :loading="loading" :disabled="!importable">
		    		Authenticate
		    		<v-icon right>mdi-send</v-icon>
		    	</v-btn>
		    	<v-btn :loading="loading"  :disabled="loading" @click="showCron" color="success">CronJobs<v-icon  size="16" right dark>mdi-send</v-icon></v-btn>
		    </v-card-title>
		    <v-card-text>
		    	<v-row>
			    	<v-col>
			    		<v-textarea
			                v-model="apiKey"
			                :rules="[rules.required]"
			                prepend-icon="mdi-email"
			                :loading="loading"
			                label="API Key"
			                auto-grow
                        	rows="1"
			                hide-details="auto"
		              	></v-textarea>
			    	</v-col>
			    	<v-col>
			    		<v-textarea
			                v-model="orgId"
			                :rules="[rules.required]"
			                prepend-icon="mdi-email"
			                :loading="loading"
			                label="Organization Id"
			                auto-grow
                        	rows="1"
			                hide-details="auto"
		              	></v-textarea>
			    	</v-col>
			    	<v-col>
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
		<cron-dialog type="Atlassian Users"  interval="Daily" />
	</v-container>
</template>

<script>
	import axios from 'axios'
	import { BASE_API } from '../../../api'
	import { mapState, mapActions } from 'vuex';

	export default {
		name: 'AtlassianBoard',

		components: {
			CronDialog: () => import('../component/CronDialog')
		},

		data () {
			return {
				loading: false,
				apiKey: '5ud2KvbbqP5KohPIGSGb',
				orgId: 'c6da411c-59d4-431e-a49a-f624edd2c345',
				company_id: 'grove.co',
				snackbar: false,
		      	message: '',
		      	color: 'success',
				rules: {
		          required: value => {
		            return !!value || 'This field is required.'
		          },
		      	}
	      	}
	    },

	    computed: {
			importable () {
				return !this.loading && this.apiKey.trim() && this.orgId.trim() && this.company_id.trim()
			},
		},

		methods: {
			...mapActions(['showCronDialog']),

      		showCron () {
      			this.showCronDialog()
      		},

      		async authZoom () {
      			this.loading = true
      			try {
      				const res = await axios({
		      			url: `${BASE_API}/api/admin/atlassianauth`,
		      			data: { 
		      				api_key: this.apiKey.trim(),
		      				org_id: this.orgId.trim(),
		      				user_id: JSON.parse(localStorage.getItem('user')).id,
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