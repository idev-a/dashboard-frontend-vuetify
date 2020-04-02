<template>
	<v-container
	    id="public_data-table"
	    fluid
	    tag="section"
  	>
	    <v-card
	      class="pa-5"
	    >
	    	<v-data-table
		        :loading="loading"
		        :headers="headers"
		        :items="data"
		        :items-per-page="page"
		        item-key="run_at"
		        :search="search"
		        @update:items-per-page="getPageNum"
	      	>
	      </v-data-table>
		</v-card>
	</v-container>
</template>

<script>
	import { BASE_API, fetchPublicData, companyId } from '../../../api'
	import { validEmail } from '../../../util'
	import axios from 'axios'

 	export default {
	    name: 'PublicDataTable',

	    data: () => ({
	      loading: true,
	      search: '',

	      data: {},
	      headers: [
	      	{
	          value: 'company_id',
	          text: 'Company',
	        },
	      ],
      	}),

      	computed: {
			page () {
		        return Number(localStorage.getItem('page')) || 5
	      	}, 
		},


	    async mounted () {
	    	this.loading = true
	        this.data = await fetchPublicData('%')
	        this.loading = false
	    },

	    methods: {
	    	getPageNum (_page) {
		        localStorage.setItem('page', _page)
	      	},
	    }
	}
</script>