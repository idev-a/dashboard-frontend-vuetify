<template>
	<v-container
	    id="public_data-table"
	    fluid
	    tag="section"
  	>
	    <v-card
	      class="pa-5"
	    >
	    	<v-row
	    	>
	    		<v-col
					cols='12'
					md="6"
	    		>
					<v-select
				  	  v-model="category"
				  	  chips
			          :items="categories"
			          label="Select a Category"
			          hint="Display the table data for this company"
			          @input="changeCategory"
			        ></v-select>
	    		</v-col>
	    		<v-col
					cols='12'
					md="6"
	    		>
	    			<v-select
				  	  v-model="company"
				  	  chips
			          :items="companies"
			          :label="companyLabel"
			          hint="Display the table data for this company"
			          @input="changeCompany"
			        ></v-select>
	    		</v-col>
	    	</v-row>
	    	<public-data
	    		v-if="company"
				:title='title'
				:category='category.toLowerCase()'
				:banner="banner"
				:company="company"
			>
		  	</public-data>
		</v-card>
	</v-container>
</template>

<script>
	import { BASE_API, fetchPublicData } from '../../../api'
	import { DOMAIN_LIST } from '../../../util'
	import axios from 'axios'

 	export default {
	    name: 'PublicDataTable',

	    data: () => ({
	      loading: true,
	      search: '',
	      company: '',
	      banner: false,
	      category: 'business',
	      title: 'Business Data',
	      data: {},
	      companyLabel: 'Select a Company',
	      companies: [
	      ],
	      defaultCompanies: [
	      	'627846.com',
	      	'grove.co',
	      	'revampcybersecurity.com'
	      ],
	      defaultPersonalEmails: [
	      	'ideveloper003@gmail.com'
	      ],
	      categories: [
	      	'Business',
	      	'Personal'
	      ],

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

		components: {
	      PublicData: () => import('../component/PublicData'),
	    },

	    async mounted () {
	    	await this.fetchUsers()
	    },

	    methods: {
	    	_email (email) {
	    		return email.split('@')[1]
	    	},

	    	getPageNum (_page) {
		        localStorage.setItem('page', _page)
	      	},

	      	async fetchUsers () {
	      		let res = await axios.get(`${BASE_API}/api/users/all`)
	      		res = res.data.users
	      		const companyUsers = res.filter(user => !DOMAIN_LIST.includes(user.email.split('@')[1]))
	      		this.defaultCompanies = []
	      		const self = this;
	      		companyUsers.map(user => {
	      			if (!self.defaultCompanies.includes(user.email.split('@')[1])) {
	      				self.defaultCompanies.push(user.email.split('@')[1]) 
	      			}
	      		})
	      		const persons = res.filter(user => DOMAIN_LIST.includes(user.email.split('@')[1]))
	      		this.defaultPersonalEmails = persons.map(user => user.email)
	      	},

	      	async changeCategory () {
	      		this.company = ''
	      		if (this.category == 'Business') {
	      			this.companies = this.defaultCompanies
	      			this.companyLabel = 'Select a Company'
	      			this.title = 'Business Data'
	      		} else {
	      			this.companies = this.defaultPersonalEmails
	      			this.companyLabel = 'Select a Person'
	      			this.title = 'Personal Data'
	      		}
	      	},

	      	async changeCompany () {
	      		// this.loading = true
	      		// const res = await axios.get(`${BASE_API}/api/public/${this.company}/${this.category.toLowerCase()}`)
	        // 	this.loading = false
	        	this.company = this.company.toLowerCase()
	      	},
	    }
	}
</script>