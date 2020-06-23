<!-- create an jwt app https://marketplace.zoom.us/develop/create -->
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
		        Zoom Board (zoom_users)
		        <v-spacer></v-spacer>
		        <v-btn class="main" @click="authZoom" :loading="loading" :disabled="!importable">
		    		Authenticate
		    		<v-icon right>mdi-send</v-icon>
		    	</v-btn>
		    	<v-btn :loading="loading"  :disabled="loading" @click="showCron" color="main">CronJobs<v-icon  size="16" right dark>mdi-send</v-icon></v-btn>
		    </v-card-title>
		    <v-card-text>
		    	<v-row>
			    	<v-col>
			    		<v-textarea
			                v-model="apiKey"
			                :rules="[rules.required]"
			                prepend-icon="mdi-email"
			                :loading="loading"
			                label="JWT API Key"
			                auto-grow
                        	rows="1"
			                hide-details="auto"
		              	></v-textarea>
			    	</v-col>
			    	<v-col>
			    		<v-textarea
			                v-model="apiSecret"
			                :rules="[rules.required]"
			                prepend-icon="mdi-email"
			                :loading="loading"
			                label="JWT API Secret"
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
		<cron-dialog type="Zoom Users"  interval="Daily" />
	</v-container>
</template>

<script>
	import axios from 'axios'
	import { BASE_API } from '../../../api'
	import { mapState, mapActions } from 'vuex';

	export default {
		name: 'ZoomBoard',

		components: {
			CronDialog: () => import('../component/CronDialog')
		},

		data () {
			return {
				loading: false,
				apiKey: 'aJcQVBq0T7WbOe9V236zuQ',
				apiSecret: '4CZOtvU3pwlh4JjlIfmHYpiMEM9lFhmJQ1rX',
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
				return !this.loading && this.apiKey.trim() && this.apiSecret.trim()
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
		      			url: `${BASE_API}/api/admin/zoomcallback`,
		      			data: { 
		      				apiKey: this.apiKey.trim(),
		      				apiSecret: this.apiSecret.trim(),
		      				user_id: JSON.parse(localStorage.getItem('user')).id
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