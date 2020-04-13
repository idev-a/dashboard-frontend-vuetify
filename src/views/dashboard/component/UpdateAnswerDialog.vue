<template>
	<v-dialog v-model="show" max-width="1024px" @click:outside="closeDialog">
      	<v-card :loading="loading">
            <v-card-title>
            	<v-row>
              		<div class="headline" style="margin: 0 auto;">Update the Question & Answer</div>
	              	<v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
	              	<v-btn :disabled="loading" color="blue darken-1" text @click="updateAnswer">Save</v-btn>
              	</v-row>
            </v-card-title>
            <v-card-text>
              	<v-container>
	                <v-form
	                  ref="appForm"
	                  v-model="formValid"
	                >
	                  	<v-row>
	                  		<v-col cols="12" md="12">
		                      	<v-textarea
			                        v-model="editedItem.question"
			                        label="Question" 
			                        auto-grow
			                        rows="1"
			                        hide-details="auto"
			                        required
		                        >
		                      	</v-textarea>
		                    </v-col>
		                    <v-col cols="12" md="12">
		                      	<v-textarea
			                        v-model="editedItem.answer"
			                        label="Answer" 
			                        auto-grow
			                        rows="1"
			                        hide-details="auto"
			                        required
		                        >
		                      	</v-textarea>
		                    </v-col>
		                    <v-col cols="12" md="4">
			                    <v-select
		                            v-model="editedItem.risk"
		                            label="Risk" 
		                            :items="riskItems"
		                            @input="changeRisk"
	                            >
	                          	</v-select>
                         	</v-col>
		                </v-row>
		            </v-form>
		        </v-container>
		    </v-card-text>
		    
		</v-card>
	</v-dialog>
</template>

<script>
	import { mapState, mapActions } from 'vuex';
	export default {
		name: 'UpdateAnswerDialog',

		data: () => ({
			formValid: false,
			riskItems: [
				'High',
				'Medium',
				'Low'
			],
		}),

		computed: {
    		...mapState('publicdata', {
	    		publicItem: state => state.publicItem,
	    		updateAnswerDialog: state => state.updateAnswerDialog
	    	}),
	    	show: {
	    		set () {

	    		},
	    		get () {
	    			return this.updateAnswerDialog
	    		}
	    	},
	    	editedItem: {
	    		get () {
	    			let val = Object.assign({}, this.publicItem)
	    			if (val.high) {
						val.risk = 'High'
					} else if (val.medium) {
						val.risk = 'Medium'
					} if (val.low) {
						val.risk = 'Low'
					} 
	    			return val
	    		},
	    		set () {
	    			
	    		}
	    	}
    	},

		watch: {
			publicItem: {
				deep: true,
			    handler(val) {
			    	
			    }
			}
		},

		props: {
			loading: {
				type: Boolean,
				default: false
			}
		},

		methods: {
			closeDialog () {
				this.$emit('close-dialog', false)
			},

			changeRisk (value) {
				this.editedItem.high = value == 'High' ? 1 : 0
				this.editedItem.medium = value == 'Medium' ? 1 : 0
				this.editedItem.low = value == 'Low' ? 1 : 0
			},

			updateAnswer () {
				this.$emit('update-answer', this.editedItem)
			}
		},
	}
</script>