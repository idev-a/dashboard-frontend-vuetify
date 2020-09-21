<template>
	<v-container
    id="new-chart-board"
    fluid
    tag="section"
  >
    <v-card
      class="pa-5"
    >
      <v-card-title class="mb-4">
        Chart Board
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
	          <v-btn v-on="on" :loading="loading" :disabled="loading" @click="readChartData" color="main" class="mr-3">Read</v-btn>
	        </template>
	        <span>Read Chart Data</span>
	      </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
	          <v-btn v-on="on" :loading="loading" :disabled="!runnable" @click="showSaveDlg" color="main" class="mr-3">Save</v-btn>
	        </template>
	        <span>Save Chart</span>
	      </v-tooltip>
      </v-card-title>
      <v-row no-gutters>
      	<v-col
    			cols="auto"
    		>
      		<v-select
            v-model="company_id"
            :loading="loading"
      			outlined
      			dense
            deletable-chips
            deletable-chips
            :items="companies"
            label="Select a company"
            @change="changeCompany"
            required
          />
      	</v-col>
      </v-row>
      <v-row>
    		<v-col
    			cols="auto"
    		>
      		<v-select
      			v-model="chartType"
      			:items="chartTypes"
      			@change="changeChart"
      			:loading="loading"
      			label="Chart Type"
      			outlined
      			prepend-inner-icon="mdi-chart-bar"
      			dense
      			hint="Change between chart will clear all settings!"
      			persistent-hint
      		/>
      	</v-col>
      </v-row>
      <v-row>
      	<v-col
      		cols="12"
      		md=9
      	>
	        <v-card
	        	outlined
	        	class="mt-0"
	        	min-height=300
	        >
	        	<v-progress-linear
	        		v-if="loading"
				      indeterminate
				      color="main"
				    ></v-progress-linear>
	        	<v-card-title class="mb-4">
		          {{title}} 
		          <v-tooltip v-if="false" bottom>
			          <template v-slot:activator="{ on }">
			          	<v-btn v-on="on" @click="tempTitle = title; titleDlg=true" text icon color="success"><v-icon>mdi-pen</v-icon></v-btn>
			          </template>
			          <span>Change Title</span>
			        </v-tooltip>
		          <v-spacer></v-spacer>
		        </v-card-title>
		        <v-card-text v-if="series.length">
		        	<highcharts :options="columnChart"></highcharts>
		        </v-card-text>
	        </v-card>
	        <div
	        	v-if="!isPieChart"
	        >
	        	<div class="display-1"> Suggestions </div>
				    <v-sheet
				    	class="pa-3 mt-2"
				    	outlined
				    >
				    	<v-slide-group 
				    		show-arrows
				    		mandatory
				    	>
					      <v-slide-item
					        v-for="n in availableCharts"
					        :key="n"
					        v-slot:default="{ active, toggle }"
					      >
					        <v-btn
					          class="mx-2"
					          :input-value="active"
					          active-class="success white--text"
					          depressed
					          dense
					          rounded
					          @click="toggle(); tapSuggestion(n)"
					        >
					          {{ n }}
					        </v-btn>
					      </v-slide-item>
					    </v-slide-group>
				  	</v-sheet>
				  </div>
	      </v-col>

	      <!-- Settings -->
	      <v-col
	      	cols="12"
	      	md="3"
	      >
	      	<v-card
	        	outlined
	        	class="mt-0"
	        	min-height=300
	        >
	        	<v-card-text>
	        		<v-autocomplete
		      			v-model="table"
		      			outlined
		      			placeholder="Table"
		      			label="Table"
		      			dense
		      			class="mb-5"
		      			:items="tables"
		      			:loading="loading"
		      			@change="changeTable"
		      		/>
		      		<div
		      			v-if="!isPieChart"
		      		>
			        	<v-sheet
			        		class="pa-2"
			        		color="grey lighten-4"
			        	>
			        		<div class="title mb-3">X-axis</div>
			        		<v-autocomplete
			        			v-model="tableField"
					          outlined
					          :items="availableFields"
					          :loading="loading"
					          label="Available Field"
					          editable
					          dense
					          @change="changeField"
					        />
			        	</v-sheet>
			        	<v-sheet
			        		class="pa-2 mt-5"
			        		color="grey lighten-4"
			        		v-if="tableField=='run_at'"
			        	>
			        		<div class="title mb-3">Break down by</div>
			        		<v-autocomplete
			        			v-model="breakdownField"
					          :items="breakdownFields"
					          :loading="loading"
					          outlined
					          clearable
					          label="Available Field"
					          editable
					          dense
					          @change="changeField"
					        />
			        	</v-sheet>
			        </div>
			        <div
			        	v-else
			        >
			        	<v-sheet
			        		class="pa-2"
			        		color="grey lighten-4"
			        	>
			        		<div class="title mb-3">Slice by</div>
			        		<v-autocomplete
			        			v-model="tableField"
					          outlined
					          :items="availableFields"
					          :loading="loading"
					          label="Available Field"
					          editable
					          dense
					          @change="changeField"
					        />
					        <v-subheader class="pl-0"># of pieces</v-subheader>
					        <v-slider
					          v-model="topCnts"
					          thumb-label="always"
					          color="main"
					          thumb-size="24"
					          min="2"
						        max="10"
						        @change="changeField"
					        >
					        	<template v-slot:prepend>
						          <v-icon
						          	color="red lighten-1"
						            @click="decrementTopCnts"
						          >
						            mdi-minus
						          </v-icon>
						        </template>

						        <template v-slot:append>
						          <v-icon
						          	color="main"
						            @click="incrementTopCnts"
						          >
						            mdi-plus
						          </v-icon>
						        </template>
					        </v-slider>
			        	</v-sheet>
			        </div>
		        	<v-btn
		        		class="mt-5"
		        		text
		        		color="red lighten-1"
		        		dense
		        		@click="resetLayer"
		        	>
		        		<v-icon left>mdi-delete</v-icon>
		        		Reset Layer
		        	</v-btn>
		        </v-card-text>
	        </v-card>
	      </v-col>
      </v-row>

      <!-- Chart data -->
      <v-sheet
      	outlined
      >
      	<v-card-title>
          Chart Data <small class="ml-2">(click to see the details)</small>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            class="mb-5 mr-3"
            hide-details
          ></v-text-field>
          <v-btn @click="deleteChartData" :disabled="selectedChartData.length == 0" text icon color="red">
            <v-icon>
              mdi-delete
            </v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
	      	<v-data-table
	          v-model="selectedChartData"
	          :loading="loading"
	          :headers="headers"
	          :items="chartData"
	          :items-per-page="page"
	          item-key="id"
	          :search="search"
	          show-select
	          @update:items-per-page="getPageNum"
	          @click:row="showDetails"
	        > 
	        </v-data-table>
	      </v-card-text>
      </v-card-text>
	    </v-sheet>
    </v-card>

    <!-- Save Dialog -->
    <v-dialog
    	v-model="titleDlg"
    	max-width=500
    >
    	<v-card>
    		<v-card-title>
    			Save Custom Chart
    		</v-card-title>
    		<v-card-text>
    			<v-form
    				ref="form"
    				v-model="valid"
    			>
    				<v-text-field
    					outlined
    					dense
    					v-model="tempTitle"
    					label="Title"
    					:rules="[rules.required]"
    				/>
    				<v-textarea
    					outlined
    					v-model="description"
    					label="Desctiption"
    				/>
    			</v-form>
    		</v-card-text>
    		<v-card-actions>
    			<v-spacer />
    			<v-btn text color="main" :loading="loading" :disabled="!valid || loading" @click="saveChart">Ok</v-btn>
    		</v-card-actions>
    	</v-card>
    </v-dialog>

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
import { 
	getCompaniesUsers,
	fetchTables,
	fetchTableFields,
	Post,
	Get
} from '@/api'
import {
	columnChart
} from '@/util'
import { mapState } from 'vuex'

export default {
	name: "NewChartBoard",

	data () {
		return {
			loading: false,
			snackbar: false,
			message: '',
			color: 'success',
			chartType: 'Bar',
			chartTypes: [
				'Line',
				'Pie',
				'Bar',
				'Area'
			],
			company_id: '',
			companies: [],
			table: '',
			tableField: '',
			tableFields: [],
			breakdownField: '',
			tables: [],
			series: [],
			categories: [],
			title: 'Unsaved',
			description: '',
			tempTitle: '',
			subtitle: '',
			ylabel: 'Counts',
			valid: true,
			chartId: -1,
			titleDlg: false,
			topCnts: 3,
			savePossible: false,
			chartData: [],
      selectedChartData: [],
      search: '',
			opt_out_tables: [
				'acl', 'security_questions', 'feeds', 'cronjob', 'custom_charts', 
				'daily_tips', 'delivery_history', 'directories',
				'dropbox_sharing', 'helps', 'companies', 'angelcompanies',
				'weekly_tips', 'topics'],
			rules: {
        required: value => !!value || 'This field is required.',
      },
      headers: [
      	{
      		text: 'Title', value: 'title'
      	},
      	{
      		text: 'Desc', value: 'description'
      	},
      	{
      		text: 'Type', value: 'chart_type'
      	},
      	{
      		text: 'Table', value: 'table'
      	},
      	{
      		text: 'Field', value: 'table_field'
      	},
      	{
      		text: 'Breakdown Field', value: 'breakdown_field'
      	},
      	{
      		text: 'Created', value: 'run_at'
      	}
      ]
		}
	},

	computed: {
		...mapState(['page']),

		runnable () {
			return !this.loading && this.savePossible
		},
		availableFields () {
			return this.tableFields
		},
		columnChart () {
			return columnChart(this.title, this.subtitle, this.ylabel, this.series, this.categories, this.chartType)
		},
		availableCharts () {
			return ['Bar',  'Line', 'Area']
		},
		breakdownFields () {
			const fields = []
			this.tableFields.map(field => {
				if (field != 'run_at') {
					fields.push(field)
				}
			})
			return fields
		},
		isPieChart () {
			return this.chartType.toLowerCase() == 'pie'
		}
	},

	mounted () {
		this.fetchCompanies()
		this.getTables()
		this.readChartData()
	},

	methods: {
		getPageNum (_page) {
      localStorage.setItem('page', _page)
    },
		showSnackbar (res) {
			this.snackbar = true
			this.message = res.message
			this.color = res.status
		},
		showSaveDlg () {
			this.tempTitle = this.title; 
			this.titleDlg = true
		},
		async readChartData () {
			this.loading = true
			const res = await Get('admin/chart/read/new')
			this.showSnackbar(res)
			this.chartData = res.items
			this.loading = false
		},
		async showDetails (item) {
			this.chartId = item.id
			this.title = item.title
			this.description = item.description
			this.chartType = item.chart_type
			this.table = item.table
			await this.changeTable()
			this.tableField = item.table_field
			this.breakdownField = item.breakdown_field
			this.topCnts = item.pieces_cnt
			this.changeField()
		},
		async deleteChartData () {
			await this.confirm('Do you really want to delete data?', this._deleteChartData)
    },
    async _deleteChartData () {
      this.loading = true
      const ids = this.selectedChartData.map(item => item.id)
      const res = await Post(`admin/chart/delete/new`, { ids })
      if (res.status == 'success') {
	      this.chartData = this.chartData.filter(item => !ids.includes(item.id))
      }
      this.showSnackbar(res)
      this.loading = false
    },
		async confirm(msg, callback) {
      await this.$dialog.confirm({
        text: msg,
        title: 'Warning',
        actions: {
          false: 'No',
          true: {
            color: 'red',
            text: 'Yes',
            handle: () => {
              callback()
            }
          }
        }
      })
    },
		saveChart () {
			this.confirm('Do you want to save this chart?', this._saveChart)
		},
		async _saveChart () {
			const data = {
				chartId: this.chartId,
				title: this.tempTitle,
				description: this.description,
				chartType: this.chartType,
				table: this.table,
				tableField: this.tableField,
				breakdownField: this.breakdownField,
				topCnts: this.topCnts
			}
			this.loading = true
			const res = await Post('admin/chart/save/new', data)
			this.showSnackbar(res)
			if (res.status == 'success') {
				this.title = this.tempTitle
				this.chartId = res.chart_id
			}
			this.titleDlg = false
			this.loading = false
		},
		decrementTopCnts () {
      this.topCnts--
      this.changeField()
    },
    incrementTopCnts () {
      this.topCnts++
      this.changeField()
    },
		async fetchCompanies () {
      this.loading = true
      this.companies = await getCompaniesUsers()
      if (this.companies.length) {
      	this.company_id = this.companies[0]
      }
      this.loading = false
    },
    async getTables () {
      this.loading = true
      const _tables = await fetchTables()
      this.tables = _tables.filter(table => !this.opt_out_tables.includes(table))
      this.loading = false
    },
    async changeCompany () {
    	this.loading = true
    	if (this.table && this.tableField) {
    		this.changeField()
    	}

    	this.loading = false
    },
    async changeChart () {
    	// initialze all options
    	this.resetLayer()
    },
    async changeTable () {
    	this.loading = true
    	this.tableFields = await fetchTableFields(this.table, this.chartType)
    	this.tableField = ''
    	this.breakdownField = ''
    	this.loading = false
    },
    async changeField () {
    	this.loading = true
    	const res = await Post('admin/chart/change-field', {
    		company_id:this.company_id,
    		table: this.table,
    		tableField: this.tableField,
    		breakdownField: this.breakdownField,
    		chartType: this.chartType,
    		topCnts: this.topCnts
    	})
    	this.series = res.series
    	this.categories = res.categories
    	if (res.status == 'success') {
    		this.savePossible = true
    	}
    	this.showSnackbar(res)
    	this.loading = false
    },
    changeTitle () {
    	this.title = this.tempTitle
    	this.titleDlg = false
    },
    tapSuggestion (chart) {
    	if (chart == 'Pie') {

    	} else {
    		this.chartType = chart
    	}
    },
    resetLayer () {
    	this.table = ''
    	this.tableField = ''
    	this.series = []
    	this.categories = []
    	this.title = 'Unsaved'
    	this.breakdownField = ''
    	this.topCnts = 2
    	this.savePossible = false
    	this.chartId = -1
    }
	},
}
</script>

<style>
.v-text-field__details {
	display: none !important;
}
</style>