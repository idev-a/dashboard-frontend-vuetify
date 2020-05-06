<template>
	<v-expansion-panel
		v-if="data"
	>
		<v-expansion-panel-header>
			<v-row align="center">
				<div v-if="mode"  class="align-self-center">
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
				<b class="display-2 d-block">{{data.question}}</b>
            </v-row>
		</v-expansion-panel-header>
		<v-expansion-panel-content>
			<template>
				<update-answer-dialog 
					v-if="mode"
					:loading="loading"
					@update-answer="updateItem"
				/>
		        <div v-for="item in get_json(data)" :key="item.num">
					<v-row>
		                <v-col
		                  cols="12"
		                >
		                  <v-card shaped outlined class="my-0 pa-4 p-relative whoxy-block">
		                  	<v-chip v-if="item.registrant_contact" class="whoxy-date secondary mb-2">{{beautifyDate(item.registrant_contact.query_time)}}</v-chip>
		                    <div class="mb-2"><b>Owner:</b> <span>{{item.registrant_contact.full_name}}</span></div>
		                    <div class="mb-2"><b>Company:</b> <span>{{getField(item.administrative_contact, 'company_name')}}</span></div>
		                    <div class="mb-2"><b>Domain:</b> <span>{{getField(item.domain_registrar, 'registrar_name')}}</span></div>
		                    <div class="mb-2"><b>Geolocation:</b> <span>{{getField(item.registrant_contact,'city_name')}}, {{getField(item.registrant_contact, 'state_name')}} {{getField(item.registrant_contact, 'zip_code')}}, {{getField(item.registrant_contact, 'country_name')}}</span></div>
		                    <div class="mb-2"><b>Email:</b> <span>{{getField(item.administrative_contact, 'email_address')}}</span></div>
		                    <div class="mb-2"><b>Phone:</b> <span>{{getField(item.administrative_contact, 'phone_number')}}</span></div>
		                    <div class="mb-2"><b>Email:</b> <span v-html="beautifyEmail(getField(item.administrative_contact, 'email_address'))"></span></div>
		                    <div class="mb-2"><b>Nameservers:</b> <span>{{item.name_servers.join(', ')}}</span></div>
		                    <div class="mb-2"><b>Status:</b> <span>{{item.domain_status[0]}}</span></div>
		                  </v-card>
		                </v-col>
		            </v-row>
				</div>
			</template>
		</v-expansion-panel-content>
	</v-expansion-panel>
</template>	

<script>
	import { get_json, beautifyEmail, beautifyDate } from '../../../util'
	import { mapState, mapActions } from 'vuex';

	export default {
		name: 'PublicDataWhoxy',

		data: () => ({
    		loading: false,
    	}),

		props: {
			data: {
				type: Object,
			},
			mode: {
      			type: Boolean,
      			default: false
      		}
		},

		components: {
	      	UpdateAnswerDialog: () => import('./UpdateAnswerDialog'),
		},

		methods: {
			...mapActions('publicdata', ['updateAnswer', 'updateComponentKey', 'setPublicItem', 'showUpdateAnswerDialog', 'showUploadBtn', 'setStaticField']),

			get_json,

			beautifyEmail,

			beautifyDate,

			showDialog () {
	          this.showUploadBtn(false)
	          this.setStaticField(true)
	          this.setPublicItem(this.data)
	          this.showUpdateAnswerDialog(true)
	        },

	      	async updateItem (item) {
		        this.loading = true
		        await this.updateAnswer(item)
		        this.loading = false

		        this.showUpdateAnswerDialog(false)
		        this.updateComponentKey()
	      	},

	      	getField(item, attr) {
	      		if (item) {
	      			return item[attr]
	      		} else {
	      			return ''
	      		}
	      	}
		}
	}
</script>