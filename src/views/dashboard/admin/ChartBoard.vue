<template>
	<v-container
	    id="chart-board"
	    fluid
	    tag="section"
  	>
	    <v-card
	      class="pa-5"
	    >
	    	<v-card-title>
		        Chart Board
		        <v-spacer></v-spacer>
		        
		        <v-btn :loading="loading" :disabled="!runnable" @click="testChart" color="success">Test Chart<v-icon  size="16" right dark>mdi-send</v-icon></v-btn>
	      	</v-card-title>
	      	<v-card-text>
	      		<v-row
		    	>
		    		<v-col
						cols='12'
						md='6'
						v-if="false"
		    		>
		    			<v-select
				          v-model="chartType"
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
		    		>
		    			<v-text-field
			                v-model="label"
			                prepend-icon="mdi-clipboard-text"
			                label="Label of select"
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
			                single-line
			                class="mx-3"
		              	></v-text-field>
		    		</v-col>
		    		<v-col
						cols='12'
						md="4"
		    		>
		    			<v-select
				          v-model="targetTable"
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
		    			<v-text-field
			                v-model="condition"
			                prepend-icon="mdi-magnify"
			                label="What kind of data do you want to display (Query Where Condition)"
			                hint="Input the query conditions as you want (Ctrl + Enter to run the test)"
			                single-line
			                @keyup.ctrl.13="keyDownOnTest"
		              	></v-text-field>
		    		</v-col>
			    </v-row>
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
	import { downloadCSV, pieChart, barchart } from '../../../util'
	import axios from 'axios'

  	export default {
	    name: 'ChartBoard',

	    data: () => ({
	      loading: false,
	      done: false,
	      modal: false,
	      runnable: true,
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
	      color: 'success'
	    }),

	    computed: {
	    	pieChart () {
	    		return pieChart(this.title, this.data['Pie Chart'], this.total)
	    	},

	    	barChart () {
	    		return barchart(this.title, '', '#', this.data['Bar Chart'])
	    	}
	    },

	    mounted () {
	    	this.getTables()
	    },

	    methods: {
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

      		async testChart () {
		    	this.loading = true
		    	this.headers = []

		    	try {
			    	const res = await axios({
		      			url: `${BASE_API}/api/admin/testchart`,
		      			data: { 
		      				targetTable: this.targetTable,
		      				condition: this.condition,
		      				chartType: this.chartType,
		      				dataLabel: this.dataLabel
		      			},
		      			method: 'POST'
		      		})
		      		this.data = res.data.data
		      		this.total = res.data.total
	      			this.message = res.data.message
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