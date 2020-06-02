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
		        Chrome Extension Board
		        <v-spacer></v-spacer>
	        	<v-btn :loading="loading" :disabled="loading" @click="runAction" color="success">Run<v-icon  size="16" right dark>mdi-send</v-icon></v-btn>
		    </v-card-title>
		    <v-card-title>
		    	<v-text-field
	                v-model="search"
	                append-icon="mdi-magnify"
	                label="Search"
	                class="mb-5"
	                single-line
	                hide-details
              	></v-text-field>
          	</v-card-title>
		    <v-card-text>
		    	<v-data-table
		    		v-model="selectedItems"
			        :loading="loading"
			        :headers="headers"
			        :items="items"
			        :items-per-page="page"
			        item-key="_id"
			        :search="search"
			        show-select
			        @update:items-per-page="getPageNum"
			      > 
			  	</v-data-table>
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
		name: 'ChromeExtensionBoard',

		data () {
			return {
				done: false,
				loading: false,
				search: '',
				slackClientId: ' ',
				slackClientSecret: ' ',
				snackbar: false,
		      	message: '',
		      	color: 'success',
		      	items: [],
		      	selectedItems: [],
		      	headers: [
		      		{
			      		text: 'User Id',
			      		value: 'user_id'
			      	},
			      	{
			      		text: 'Name',
			      		value: 'ext_name'
			      	},
			      	{
			      		text: 'Description',
			      		value: 'description'
			      	},
			      	{
			      		text: 'CSP Risk',
			      		value: 'risk_csp'
			      	},
			      	{
			      		text: 'Permission Risk',
			      		value: 'risk_permissions'
			      	},
			      	{
			      		text: 'Webstore Risk',
			      		value: 'risk_webstore'
			      	},
			      	{
			      		text: 'Risk',
			      		value: 'risk_total'
			      	},
			      	{
			      		text: 'Permission Warnings',
			      		value: 'permission_warnings'
			      	},
			      	{
			      		text: 'Version',
			      		value: 'version'
			      	},
			      	{
			      		text: 'Rating',
			      		value: 'rating'
			      	},
			      	{
			      		text: 'Run At',
			      		value: 'run_at'
			      	},
		      	],
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
			page () {
		        return Number(localStorage.getItem('page')) || 5
	     	},
		},

		methods: {
			keyDownOnScope () {
      			if (this.query) {
      				this.runAction()
      			}
      		},

      		async runAction () {
      			this.loading = true
      			try {
			    	const data = await axios({
		      			url: `${BASE_API}/api/admin/ext/read`,
		      			method: 'GET'
		      		})
		      		this.items = data.data.exts
	      			this.message = data.data.message
	      			this.color = data.data.status
		    	} catch(e) {
		    		this.message = 'Something wrong happened on the server.'
		    	} finally {
	      			this.loading = false
	      			this.snackbar = true
		    	}
      		},

      		getPageNum (_page) {
		        localStorage.setItem('page', _page)
		    },
      	}
  	}
</script>
