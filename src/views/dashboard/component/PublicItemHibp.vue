<template>
	<v-expansion-panel
		v-if="data"
	>
		<v-expansion-panel-header>
			<v-row>
				<b class="display-2 d-block">{{data.question}}</b>
				<div class="align-self-center">
                  <v-btn
                    color="success"
                    icon
                    @click="showDialog"
                  >
                    <v-icon
                      color="success"
                    >
                      mdi-pencil
                    </v-icon>
                  </v-btn>
                </div>
            </v-row>
		</v-expansion-panel-header>
		<v-expansion-panel-content>
			<template>
				<v-data-table
			        :headers="hibpHeaders"
			        :items="parse_array(data)"
			        :items-per-page="page"
			        item-key="Email"
			        @update:items-per-page="getPageNum"
		      	>
		      		<template v-slot:item.Email="{ item }">
	                  <span v-html="beautifyEmail(item.Email)"></span>
	                </template>
			    </v-data-table>
				<update-answer-dialog 
					:dialog="dialog"
					:loading="loading"
					:item="data" 
					@close-dialog="closeDialog"
					@update-answer="updateItem"
				/>
			</template>
		</v-expansion-panel-content>
	</v-expansion-panel>
</template>

<script>
	import { 
		parse_array,
		beautifyEmail
	} from '../../../util'
	import { mapState, mapActions } from 'vuex';

	export default {
    	name: 'PublicItemHibp',

    	components: {
	      	UpdateAnswerDialog: () => import('./UpdateAnswerDialog'),
		},

		computed: {
			page () {
		        return Number(localStorage.getItem('page')) || 5
	      	}, 
	    },

    	data: () => ({
    		dialog: false,
    		loading: false,
    		hibpHeaders: [
			 	{
		          value: 'Breach',
		          text: 'Breach',
		        },
		        {
		          value: 'Email',
		          text: 'Email',
		        },
			],
    	}),

    	props: {
	      	data: {
		        type: Object,
      		},
      	},
      	methods: {
      		...mapActions('publicdata', ['updateAnswer', 'updateComponentKey']),
	    	parse_array,
			beautifyEmail,

			getPageNum (_page) {
		        localStorage.setItem('page', _page)
	      	},

	    	showDialog () {
	    		this.dialog = true
	    	},

	    	closeDialog () {
				this.dialog = false
			},

			async updateItem (item) {
				this.loading = true
				await this.updateAnswer(item)
				this.loading = false

				this.closeDialog ()
				this.updateComponentKey()
			}
      	},
    }
</script>