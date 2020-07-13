<template>
	<v-container
	    id="random-data"
	    fluid
	    tag="section"
  	>
	    <v-card
	      class="pa-5"
	    >
	    	<v-card-title>
		        <div>Generate Random Data</div>
			    <v-spacer></v-spacer>
			    <v-btn :loading="loading" :disabled="loading" @click="generateData" color="main">Generate<v-icon right size="16" dark>mdi-send</v-icon></v-btn>
			    <v-btn :loading="loading" :disabled="loading" @click="saveData" color="main">Save<v-icon right size="16" dark>mdi-send</v-icon></v-btn>
		        <v-btn v-if="false" :loading="loading" :disabled="loading || (!items.length && !selectedItems.length)" @click="downloadCSV" color="main"><v-icon  size="16" dark>mdi-download</v-icon></v-btn>
			</v-card-title>

			<v-card-text>
				<v-form 
					ref="inputForm"
					v-model="valid"
				>
					<v-row>
						<v-col
							cols='12'
							md="3"
			    		>
				    		<v-combobox
								v-model="form.company"
								:items="companies"
								label="Company"
								outlined
				            >
				            </v-combobox>
				    	</v-col>
					</v-row>
				</v-form>
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
		name: 'RandomBoard',

		data () {
			return {
				valid: true,
				loading: false,
				items: [],
				selectedItems: [],
				form: {
					company: ''
				},
				companies: [],
				message: '',
				snackbar: false,
				color: 'success'
			}
		},

		computed: {
	    	...mapState(['page']),
	    },

	    methods: {
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

		    generateData () {

		    },

		    saveData () {

		    }
	    }
	}
</script>