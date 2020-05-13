<template>
	<v-container
	    id="chart-board"
	    fluid
	    tag="section"
  	>
	    <v-card
	      class="pa-5"
	    >
	    	<v-card-title class="mb-4">
		        Chart Board
	      		<v-spacer></v-spacer>
		        <v-btn :loading="loading" :disabled="!runnable" @click="testChart" color="success" class="mr-3">Test Chart<v-icon  size="16" right dark>mdi-send</v-icon></v-btn>
      			<v-btn :loading="loading" :disabled="tested != 'success'" @click="saveChart" color="success">Save Charts<v-icon  size="16" right dark>mdi-send</v-icon></v-btn>
      			<v-btn :loading="loading" :disabled="loading" @click="readAll" color="success">Read All<v-icon  size="16" right dark>mdi-database</v-icon></v-btn>
	      	</v-card-title>
	      	<v-card-text>
	      		<v-form
	              ref="form"
	              v-model="valid"
	            >
	      		<v-row
		    	>
		    		<v-col
						cols='12'
						md='4'
		    		>
		    			<v-select
				          v-model="company"
				          :rules="[rules.required]"
					  	  chips
				          :items="companies"
				          class=""
				          label="Select a company"
				          hint="Select a company you want to get the chart data"
				          :error="error"
				          :error-messages="errorMessages"
				        ></v-select>
		    		</v-col>
		    		<v-col
						cols='12'
						md='4'
		    		>
		    			<v-select
				          v-model="chartType"
				          :rules="[rules.required]"
					  	  chips
				          :items="chartTypes"
				          class=""
				          label="Select a type for the chart"
				          hint="Select a proper type of chart you want"
				          :error="error"
				          :error-messages="errorMessages"
				        ></v-select>
		    		</v-col>
		    		<v-col
						cols='12'
						md='4'
		    		>
		    			<v-select
				          v-model="chartGroup"
				          :rules="[rules.required]"
					  	  chips
				          :items="chartGroups"
				          class=""
				          label="Select a group"
				          hint="Select a group"
				          :error="error"
				          :error-messages="errorMessages"
				        ></v-select>
			    	</v-col>
		    		
		    		<v-col
						cols='12'
						md="8"
		    		>
		    			<v-text-field
			                v-model="label"
			                prepend-icon="mdi-clipboard-text"
			                label="Label of select"
			                hint="The label appearing on the user side"
			                :rules="[rules.required]"
			                single-line
			                class="mx-3"
		              	></v-text-field>
		    		</v-col>
		    		<v-col
						cols='12'
						md='6'
		    		>
		    			<v-text-field
			                v-model="title"
			                prepend-icon="mdi-clipboard-text"
			                label="Title of chart"
			                hint="Title of chart"
			                :rules="[rules.required]"
			                single-line
			                class="mx-3"
		              	></v-text-field>
		    		</v-col>
		    		<v-col
						cols='12'
						md="3"
		    		>
		    			<v-select
				          v-model="targetTable"
				          :rules="[rules.required]"
					  	  chips
				          :items="tableNames"
				          class=""
				          label="Select a target table"
				          hint="Select a table you want change chart"
				        ></v-select>
			    		<!-- <v-textarea
			                v-model="testquery"
			                label="SQL Query" 
			                hint="Ctrl + Enter to run the query"
			                rows="3"
			                outlined
			                @keyup.ctrl.13="keyDownOnQuery"
			            /> -->
			    	</v-col>
			    	<v-col
						cols='12'
						md='3'
		    		>
		    			<v-text-field
			                v-model="company_id_field"
			                prepend-icon="mdi-clipboard-text"
			                label="Field name of company_id"
			                :hint="companyIdHint"
			                :rules="[rules.required]"
			                single-line
			                class="mx-3"
		              	></v-text-field>
		    		</v-col>
			    	<v-col
						cols='12'
						md="6"
		    		>
		    			<v-text-field
			                v-model="dataLabel"
			                prepend-icon="mdi-magnify"
			                label="What kind of data do you want to display (Data Label)"
			                hint="Data label appeared on the charts"
			                single-line
		              	></v-text-field>
		    		</v-col>
			    	<v-col
						cols='12'
		    		>
		    			<v-textarea
			                v-model="condition"
			                :rules="[rules.required]"
			                prepend-icon="mdi-magnify"
			                label="What kind of data do you want to display (Query Where Condition)"
			                hint="Input the query conditions as you want (Ctrl + Enter to run the test)"
			                rows="1"
			                auto-grow
			                @keyup.ctrl.13="keyDownOnTest"
		              	></v-textarea>
		    		</v-col>
			    </v-row>
				</v-form>
	      	</v-card-text>
	      	<v-spacer></v-spacer>
	      	<v-row>
	      		<v-col
					cols='12'
					md="4"
	    		>
	    			<v-sheet class="min-50">
	      				<highcharts v-if="!loading && done" :options="pieChart"></highcharts>
	      			</v-sheet>
	      		</v-col>
	      		<v-col
					cols='12'
					md="6"
	    		>
	    			<v-sheet class="min-50">
	      				<highcharts v-if="!loading && done" :options="barChart"></highcharts>
	      			</v-sheet>
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
	import { BASE_API } from '../../../api'
	import { DOMAIN_LIST, downloadCSV, pieChart, barchart } from '../../../util'
	import axios from 'axios'

  	export default {
	    name: 'ChartBoard',

	    data: () => ({
	      loading: false,
	      valid: true,
	      tab: null,
	      done: false,
	      modal: false,
	      runnable: true,
	      tested: 'failed',
	      company: '',
	      company_id_field: 'company_id',
	      companies: [],
	      defaultCompanies: [
	      	'627846.com',
	      	'grove.co',
	      	'revampcybersecurity.com'
	      ],
	      chartGroup: 'Default',
	      chartGroups: [
	      	'Default',
	      ],
	      chartType: 'Pie Chart',
	      chartTypes: [
	      	'Pie Chart',
	      	'Bar Chart'
	      ],
	      query: '',
	      testquery: '',
	      dataLabel: '',
	      queryList: [],
	      error: false,
	      errorMessages: '',
	      title: '',
	      label: '',
	      items: [],
	      targetTable: '',
	      condition: '',
	      tableNames: [],
	      data: [],
	      total: 0,
	      snackbar: false,
	      message: '',
	      color: 'success',
	      rules: {
	          required: value => {
	            return !!value || 'This field is required.'
	          },
	      }
	    }),

	    computed: {
	    	pieChart () {
	    		return pieChart(this.title, this.data['Pie Chart'], this.total)
	    	},

	    	barChart () {
	    		return barchart(this.title, '', '#', this.data['Bar Chart'])
	    	},

	    	companyIdHint () {
	    		return 'The field name of table ' + this.targetTable + ' to represent comapany id'
	    	}
	    },

	    mounted () {
	    	this.getTables()

	    	this.fetchUsers()
	    },

	    methods: {
	    	async fetchUsers () {
	    		this.loading = true
	      		let res = await axios.get(`${BASE_API}/api/users/all`)
	      		res = res.data.users
	      		const companyUsers = res.filter(user => !DOMAIN_LIST.includes(user.email.split('@')[1]))
	      		this.companies = []
	      		const self = this;
	      		companyUsers.map(user => {
	      			if (!self.companies.includes(user.email.split('@')[1])) {
	      				self.companies.push(user.email.split('@')[1]) 
	      			}
	      		})
	      		this.loading = false
	      	},

      		async getTables () {
      			const query = 'Show Tables'
      			try {
      				const res = await axios({
		      			url: `${BASE_API}/api/admin/query`,
		      			data: { query },
		      			method: 'POST'
		      		})
		      		this.tableNames = res.data.items.map(item => { return item.Tables_in_revamp })
      			} catch(e) {
		    		console.log(e)
		    	} finally {
	      			this.loading = false
		    	}
      		},

      		keyDownOnTest () {
      			if (this.condition && this.targetTable) {
      				this.testChart()
      			}
      		},

      		async saveChart () {
      			this.$refs.form.validate()

        		if (!this.valid) { 
        			return
        		}

		    	this.loading = true
		    	this.headers = []
		    	const data =  { 
      				company_id_field: this.company_id_field,
      				targetTable: this.targetTable,
      				condition: this.condition,
      				chartType: this.chartType,
      				dataLabel: this.dataLabel,
      				company: this.company,
      				label: this.label,
      				title: this.title
      			}

      			try {
			    	const res = await axios({
		      			url: `${BASE_API}/api/admin/chart/save`,
		      			data,
		      			method: 'POST'
		      		})
	      			this.message = res.data.message
	      			this.color = res.data.status
		    	} catch(e) {
		    		this.message = e.response.data.message
		    	} finally {
	      			this.loading = false
	      			this.snackbar = true
	      			this.done = true
		    	}
      		},

      		async testChart () {
  			 	this.$refs.form.validate()

        		if (!this.valid) { 
        			return
        		}

		    	this.loading = true
		    	this.headers = []
		    	const data =  { 
      				company_id_field: this.company_id_field,
      				targetTable: this.targetTable,
      				condition: this.condition,
      				chartType: this.chartType,
      				dataLabel: this.dataLabel,
      				company: this.company,
      			}
		    	try {
			    	const res = await axios({
		      			url: `${BASE_API}/api/admin/chart/test`,
		      			data,
		      			method: 'POST'
		      		})
		      		this.data = res.data.data
		      		this.total = res.data.total
	      			this.message = res.data.message
	      			this.tested = res.data.status
	      			this.color = res.data.status
		    	} catch(e) {
		    		this.message = e.response.data.message
		    	} finally {
	      			this.loading = false
	      			this.snackbar = true
	      			this.done = true
		    	}
		    }
	    }
	}
</script>