<template>
	<v-expansion-panel
		v-if="data"
	>
		<v-expansion-panel-header>
			<v-row>
				<b class="display-2 d-block">{{data.question}}</b>
				<div v-if="mode" class="align-self-center">
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
			</v-hover>
		<v-expansion-panel-content>
			<div class="pre-strim">{{removeQuotes(data.answer)}}</div>
			<update-answer-dialog 
				v-if="mode"
				:loading="loading"
				@close-dialog="closeUpdateAnswerDialog"
				@update-answer="updateItem"
			/>
		</v-expansion-panel-content>
	</v-expansion-panel>
</template>

<script>
	import { 
		get_json,
		removeQuotes
	} from '../../../util'
	import { mapState, mapActions } from 'vuex';

	export default {
    	name: 'PublicDataPanelItemPre',

    	components: {
	      	UpdateAnswerDialog: () => import('./UpdateAnswerDialog'),
		},

    	data: () => ({
    		loading: false,
    	}),

    	mounted () {
    		this.setPublicItem(this.data)
    	},

    	props: {
	      	data: {
		        type: Object,
      		},
      		mode: {
      			type: Boolean,
      			default: false
      		},
      	},
      	methods: {
      		...mapActions('publicdata', ['updateAnswer', 'updateComponentKey', 'setPublicItem', 'showUpdateAnswerDialog', 'closeUpdateAnswerDialog']),

	    	removeQuotes,

	    	showDialog () {
	    		this.setPublicItem(this.data)
	    		this.showUpdateAnswerDialog()
	    	},

			async updateItem (item) {
				this.loading = true
				await this.updateAnswer(item)
				this.loading = false

				this.closeUpdateAnswerDialog()
				this.updateComponentKey()
			}
      	},
    }
</script>
