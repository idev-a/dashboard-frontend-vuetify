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
		        RSS Board
		        <v-spacer></v-spacer>
		        <v-btn :loading="loading" :disabled="loading" @click="readRss" color="success">Read All<v-icon  size="16" right dark>mdi-database</v-icon></v-btn>
		        <v-btn :loading="loading" :disabled="loading || !link" @click="populateRss" color="success">Populate<v-icon  size="16" right dark>mdi-send</v-icon></v-btn>
	      	</v-card-title>
		    <v-row
		    	>
	    		<v-col
					cols='12'
	    		>
		    		<v-textarea
		                v-model="link"
		                label="RSS Link" 
		                hint="Ctrl + Enter to populate rss feeds"
		                rows="3"
		                outlined
		                @keyup.ctrl.13="keyDownOnRss"
		            />
		    	</v-col>
		    </v-row>
		    <v-data-table
		        :loading="loading"
		        :headers="headers"
		        :items="items"
		        :items-per-page="page"
		        item-key="id"
		        :search="search"
		        @update:items-per-page="getPageNum"
		        @click:row="showDetails"
	      	> 
	      		<template v-slot:item.link="{ item }">
		            <a class="subtitle-2" :href="item.link" target="_blank">{{ item.link }}</a>
		        </template>
		        <template v-slot:item.high_risk="{ item }">
			          <v-chip :color="levelColor(item.high_risk)" dark>
			            <div class="subtitle-2">{{ levelValue(item.high_risk) }}</div>
			          </v-chip>
		        </template>
		        <template v-slot:item.content="{ item }">
		            <span class="content" v-html="item.content" />
		        </template>
		  	</v-data-table>
	    </v-card>

	    <v-snackbar v-model="snackbar" :timeout="3000" :color="snackColor">
	      {{ snackText }}
	      <v-btn text @click="snackbar = false">Close</v-btn>
	    </v-snackbar>

     	<v-dialog
	      v-model="dialog"
	      max-width="1024"
	    >
	      <v-card>
	        <v-card-title v-if="mode == 'View'" class="headline">{{rss.feed}}</v-card-title>
	        <v-card-title>
		        <v-textarea
		            v-if="mode == 'Edit'"
	                v-model="editItem.feed"
	                label="Feed" 
	                auto-grow
	                rows="1"
	                :rules="[rules.required]"
	                hide-details="auto"
	                class="mb-3"
	                required
	                >
              	</v-textarea>
          </v-card-title>
	        <v-card-title v-if="mode == 'View'" class="subtitle-2 text--gray">{{rss.title}}</v-card-title>

	        <v-card-text>
	          <span v-if="mode == 'View'" class="content dialog" v-html="rss.content" />
	          <v-textarea
	            v-if="mode == 'Edit'"
                v-model="editItem.content"
                label="Content" 
                auto-grow
                rows="1"
                :rules="[rules.required]"
                hide-details="auto"
                required
                >
              </v-textarea>
	        </v-card-text>
	        <v-spacer />
	        <v-card-text>
	          <a v-if="mode == 'View'" class="subtitle-2 mb-3 d-block" :href="rss.link" target="_blank">{{ rss.link }}</a>
	          <v-textarea
	            v-if="mode == 'Edit'"
                v-model="editItem.link"
                label="Link" 
                auto-grow
                rows="1"
                :rules="[rules.required]"
                hide-details="auto"
                class="mb-3"
                required
                >
              </v-textarea>
        	  <v-chip v-if="mode == 'View'" :color="levelColor(rss.high_risk)" dark>
	            <div class="subtitle-2">{{ levelValue(rss.high_risk) }}</div>
          	  </v-chip>
          	  <v-select
          	  	v-if="mode == 'Edit'"
                v-model="editItem.risk"
                label="Risk" 
                :items="riskItems"
                >
              </v-select>
	        </v-card-text>
	        <v-card-actions>
	          <v-spacer></v-spacer>
	          <v-btn
	            v-if="mode == 'Edit'"
	            color="primary"
	            text
	            @click="updateFeed"
	          >
	            Update
	          </v-btn>
	          <v-btn
	            v-if="mode == 'Edit'"
	            color="primary"
	            text
	            @click="deleteFeed"
	          >
	            Delete
	          </v-btn>
	          <v-btn
	            color="primary"
	            text
	            @click="toggleMode"
	          >
	            {{ btnLabel }}
	          </v-btn>
	          <v-btn
	            color="info"
	            text
	            @click="dialog = false"
	          >
	            Close
	          </v-btn>
	        </v-card-actions>
	      </v-card>
		</v-dialog>
	</v-container>
</template>

<script>
	import { BASE_API } from '../../../api'
	import axios from 'axios'

	export default {
		name: 'RSS',

		data: () =>({
			loading: false,
			dialog: false,
			readOnly: true,
			mode: 'View',
			link: '',
			rss: {},
			defaultIndex: -1,
			editItem: {},
			riskItems: [
		        'High',
		        'Low'
	      	],
	     	search: '',
     	   	headers: [
	     	   	{
	     	   		text: 'Feed',
	     	   		value: 'feed',
	     	   		width: 180
	     	   	},
	     	   	{
	     	   		text: 'Content',
	     	   		value: 'content'
	     	   	},
	     	   	{
	     	   		text: 'Link',
	     	   		value: 'link',
	     	   	},
	     	   	{
	     	   		text: 'Risk',
	     	   		value: 'high_risk'
	     	   	}
     	   	],
			snackbar: false,
			snackText: '',
			snackColor: 'success',
			items: [],
			rules: {
		        required: value => !!value || 'This field is required.',
	      	},
		}),

		computed: {
      		page () {
		        return Number(localStorage.getItem('page')) || 5
	     	}, 

	     	btnLabel () {
	     		if (this.mode == 'Edit') {
      				return 'View'
      			} else {
      				return 'Edit'
      			}
	     	}
      	},

      	methods: {
      		levelColor (level) {
      			return level == 1 ? 'red darken-4' : 'green darken-1'
      		},

      		levelValue (level) {
      			return level == 1 ? 'High' : 'Low'
      		},

      		toggleMode () {
      			if (this.mode == 'Edit') {
      				this.mode = 'View'
      			} else {
      				this.mode = 'Edit'
      			}
  			},

      		getPageNum (_page) {
		        localStorage.setItem('page', _page)
		    },

      		keyDownOnRss () {
      			if (this.link) {
      				this.populateRss()
      			}
      		},

      		showDetails (item) {
      			this.rss = item
      			this.defaultIndex = this.items.indexOf(item)
      			this.editItem = Object.assign({}, item)
      			this.editItem.risk = this.levelValue(item.high_risk)
      			this.dialog = true
      		},

      		async deleteFeed () {
      			this.loading = true
      			this.editItem.high_risk = this.editItem.risk == 'High' ? 1 : 0
		    	try {
			    	const data = await axios({
		      			url: `${BASE_API}/api/admin/rss/delete`,
		      			data: this.editItem,
		      			method: 'POST'
		      		})
	      			this.snackText = data.data.message
	      			this.snackColor = data.data.status
	      			if (data.data.status == 'success') {
	      				this.items.splice(defaultIndex, 1)
	      			}
		    	} catch(e) {
		    		this.snackText = 'Something wrong happened on the server.'
		    	} finally {
	      			this.loading = false
	      			this.snackbar = true
		    	}
      		},

      		async updateFeed () {
      			this.loading = true
      			this.editItem.high_risk = this.editItem.risk == 'High' ? 1 : 0
		    	try {
			    	const data = await axios({
		      			url: `${BASE_API}/api/admin/rss/update`,
		      			data: this.editItem,
		      			method: 'POST'
		      		})
	      			this.snackText = data.data.message
	      			this.snackColor = data.data.status
	      			if (data.data.status == 'success') {
	      				Object.assign(this.items[this.defaultIndex], this.editItem)
	      				this.rss = this.editItem
	      			}
		    	} catch(e) {
		    		this.snackText = 'Something wrong happened on the server.'
		    	} finally {
	      			this.loading = false
	      			this.snackbar = true
		    	}
      		},

      		async readRss () {
      			this.loading = true
		    	try {
			    	const data = await axios({
		      			url: `${BASE_API}/api/admin/rss/read`,
		      			data: { rss: this.link },
		      			method: 'POST'
		      		})
		      		this.items = data.data.items
	      			this.snackText = data.data.message
	      			this.snackColor = data.data.status
		    	} catch(e) {
		    		this.snackText = 'Something wrong happened on the server.'
		    	} finally {
	      			this.loading = false
	      			this.snackbar = true
		    	}
      		},

      		async populateRss () {
		    	this.loading = true
		    	try {
			    	const data = await axios({
		      			url: `${BASE_API}/api/admin/rss/populate`,
		      			data: { rss: this.link },
		      			method: 'POST'
		      		})
		      		this.items = data.data.items
	      			this.snackText = data.data.message
	      			this.snackColor = data.data.status
	      			if (this.items.length == 0 && data.data.status == 'success') {
	      				this.snackText = 'No feeds yet'
	      				this.snackColor = 'default'
	      			}
		    	} catch(e) {
		    		this.snackText = 'Something wrong happened on the server.'
		    	} finally {
	      			this.loading = false
	      			this.snackbar = true
		    	}
		    }
      	}
	}
</script>

<style lang="scss">
	.content {
		img {
			width: 100px;
		    height: auto;
		    border-radius: 4px;
		    object-fit: contain;
		}

		&.dialog {
			img {
				width: 300px;
			}
		}
	}
</style>