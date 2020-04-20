<template>
	<v-container
	    id="query-board"
	    fluid
	    tag="section"
  	>
	    <v-card
	      class="pa-5"
	    >
	    	<v-card-title>
		        Query Board
		        <v-spacer></v-spacer>
		        <v-btn :loading="loading" :disabled="loading || !query" @click="runQuery" color="success">Run Query <v-icon  size="16" right dark>mdi-send</v-icon></v-btn>
	      	</v-card-title>
	    	<v-row
	    	>
	    		<v-col
					cols='12'
	    		>
		    		<v-textarea
		                v-model="query"
		                label="SQL Query" 
		                hint="Ctrl + Enter to run the query"
		                rows="3"
		                outlined
		                @keyup.ctrl.13="keyDownOnQuery"
		            />
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
              </v-card-title>
              <v-card-title>
              	<v-select
              		:loading="loading"
              		label="Table Columns"
					:items="headers"
					multiple
					attach
          			small-chips
          			v-model="selectedHeaders"
          			@input="updateHeaders"
              	>
          		 	<template v-slot:selection="{ attrs, item, parent, selected }">
				        <v-chip
				          v-if="item === Object(item)"
				          v-bind="attrs"
				          :color="`${item.color} lighten-3`"
				          :input-value="selected"
				          label
				          small
				        >
				          <span class="pr-2">
				            {{ item.text }}
				          </span>
				          <v-icon
				            small
				            @click="parent.selectItem(item)"
				          >mdi-close</v-icon>
				        </v-chip>
				      </template>
	            </v-select>
          	</v-card-title>
	    	<v-data-table
		        :loading="loading"
		        :headers="filteredHeaders"
		        :items="items"
		        :items-per-page="page"
		        item-key="id"
		        :search="search"
		        @update:items-per-page="getPageNum"
		      > 
		  </v-data-table>
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
	import { BASE_API } from '../../../api'
	import axios from 'axios'

  	export default {
	    name: 'DashboardApplications',

	    data: () => ({
	      loading: false,
	      search: '',
	      query: '',
	      items: [],
	      headers: [],
	      selectedHeaders: [],
	      filteredHeaders: [],
	      snackbar: false,
	      message: '',
	      color: 'success'
	 	}),

 	 	mounted () {
      	},

      	computed: {
      		page () {
		        return Number(localStorage.getItem('page')) || 5
		     }, 
      	},

      	methods: {
      		keyDownOnQuery () {
      			if (this.query) {
      				this.runQuery()
      			}
      		},

      		updateHeaders (data) {
      			if (data.length) {
      				this.filteredHeaders = this.headers.filter(header => data.includes(header.value))
      			} else {
      				this.filteredHeaders = []
      			}
      		},

      		getPageNum (_page) {
		        localStorage.setItem('page', _page)
		    },

		    async runQuery () {
		    	this.loading = true
		    	this.headers = []
		    	try {
			    	const data = await axios({
		      			url: `${BASE_API}/api/admin/query`,
		      			data: { query: this.query },
		      			method: 'POST'
		      		})
		      		data.data.headers.map(header => {
		      			this.headers.push({
		      				text: header.toUpperCase(),
		      				value: header
		      			})
		      		})
		      		this.filteredHeaders = this.selectedHeaders = this.headers
		      		this.items = data.data.items
	      			this.message = data.data.message
	      			this.color = data.data.status
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