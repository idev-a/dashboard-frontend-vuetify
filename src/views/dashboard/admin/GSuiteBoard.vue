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
		        GSuite Board
		        <v-spacer></v-spacer>
	        	<v-btn :loading="loading" :disabled="!importable"  class="mb-2" @click="importKey" color="success">Import & Run<v-icon  size="16" right dark>mdi-send</v-icon></v-btn>
		    </v-card-title>
		    <v-row>
		    	<v-col>
	    		  	<v-file-input
					    accept=".json"
					    placeholder="Import GSuite private key file"
					    prepend-icon="mdi-database-import"
					    label="Private key"
					    ref="myfile" 
					    v-model="file"
					    :loading="loading"
					    multiple 
				  	></v-file-input>
		    	</v-col>

		    	<v-col>
		    		<v-text-field
		                v-model="email"
		                :rules="[rules.required, rules.email]"
		                prepend-icon="mdi-email"
		                :loading="loading"
		                label="Owner Email"
		                hint="Ctrl + Enter to run the google drive script"
		                single-line
		                hide-details="auto"
		                @keyup.ctrl.13="keyDownOnImport"
	              	></v-text-field>
		    	</v-col>
		    </v-row>
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
				file: null,
				snackbar: false,
		      	message: '',
		      	color: 'success',
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
				return !this.loading && this.file && this.email && this.errorMessages.email.invalid
			}
		},

		methods: {
			keyDownOnImport () {
      			if (this.query) {
      				this.runQuery()
      			}
      		},

			async importKey () {
				if (!this.email || !this.file) {
					return
				}

				let formData = new FormData()
	        	for (let file of this.file) {
                	formData.append("file", file, file.name);
                }

                this.done = true
                this.loading = true
                this.file = null
		    	try {
			    	const res = await axios.post(`${BASE_API}/api/admin/gsuite/run/${this.email}`, formData)
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
</script>