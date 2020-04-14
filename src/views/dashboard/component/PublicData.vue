<template>
	<div>
	  <blockquote v-if="banner" class="blockquote">Below is the data we found on your business.</blockquote>

	  <v-card
  	  	:loading="loading"
	  	class="px-5 py-3"
	  	:class="company != '' ? 'mt-0' : ''"
	  >
	  	<v-card-title>
        {{ title }}
      	</v-card-title>
      	<div
  	  	  v-if="!loading && publicData.high"
      	>
      		<!-- General Business data -->
      		<div
				v-if="category=='business'"
      		>
		      	<v-row>
		            <v-col
		              v-if="publicData.high.domain"
		              cols="12"
		              sm="6"
		              md="6"
		            >
		            	<v-row align="center">
		                	<div v-if="mode" class="align-self-center">
			                  <v-btn
			                    color="success"
			                    icon
			                    @click="showUpdateDialog(publicData.high.domain)"
			                  >
			                    <v-icon
			                      color="success"
			                    >
			                      mdi-pencil
			                    </v-icon>
			                  </v-btn>
			                </div>
			                <div>
				                <b class="mr-2">Domain:</b>
				                <span class="display-1">{{removeQuotes(publicData.high.domain.answer)}}</span>
				            </div>
				        </v-row>
		            </v-col>
		            <v-col
		              v-if="publicData.high.website_ip"
		              cols="12"
		              sm="6"
		              md="6"
		            >
		            	<v-row align="center">
		                	<div v-if="mode" class="align-self-center">
			                  <v-btn
			                    color="success"
			                    icon
			                    @click="showUpdateDialog(publicData.high.website_ip)"
			                  >
			                    <v-icon
			                      color="success"
			                    >
			                      mdi-pencil
			                    </v-icon>
			                  </v-btn>
			                </div>
			                <div>
				                <b class="mr-2">IP:</b>
				                <span class="display-1">{{removeQuotes(publicData.high.website_ip.answer)}}</span>
				            </div>
				        </v-row>
		            </v-col>
		        </v-row>
		    </div>

		    <!-- General Personal Data -->
	    	<v-row
				v-if="category=='personal'"
	    	>
	            <v-col
	              v-if="publicData.high.name"
	              cols="12"
	              sm="6"
	              md="4"
	            >
	            	<v-row align="center">
	                	<div v-if="mode" class="align-self-center">
		                  <v-btn
		                    color="success"
		                    icon
		                    @click="showUpdateDialog(publicData.high.name)"
		                  >
		                    <v-icon
		                      color="success"
		                    >
		                      mdi-pencil
		                    </v-icon>
		                  </v-btn>
		                </div>
		                <div>
		                	<b class="mr-2">Name:</b>
			                <span class="display-1">{{publicData.high.name.answer}}</span>
			            </div>
		            </v-row>
	            </v-col>
	            <v-col
	              v-if="publicData.high.email"
	              cols="12"
	              sm="6"
	              md="4"
	            >
	            	<v-row align="center">
		               	<div v-if="mode" class="align-self-center">
		                  <v-btn
		                    color="success"
		                    icon
		                    @click="showUpdateDialog(publicData.high.email)"
		                  >
		                    <v-icon
		                      color="success"
		                    >
		                      mdi-pencil
		                    </v-icon>
		                  </v-btn>
		                </div>
		                <div>
			                <b class="mr-2">Email:</b>
			                <span class="display-1" v-html="beautifyEmail(publicData.high.email.answer)"></span>
			            </div>
		            </v-row>
	            </v-col>
	            <v-col
	              v-if="publicData.high.dob"
	              cols="12"
	              sm="6"
	              md="4"
	            >
	            	<v-row align="center">
		                <div v-if="mode" class="align-self-center">
		                  <v-btn
		                    color="success"
		                    icon
		                    @click="showUpdateDialog(publicData.high.dob)"
		                  >
		                    <v-icon
		                      color="success"
		                    >
		                      mdi-pencil
		                    </v-icon>
		                  </v-btn>
		                </div>
		                <div>
			                <b class="mr-2">Birthday:</b>
			                <span class="display-1">{{publicData.high.dob.answer}}</span>
			            </div>
		            </v-row>
	            </v-col>
	        </v-row>
	      	<v-tabs
		      class="elevation-2 mt-4"
		      color="white"
		      light
		      centered
		      grow
		      show-arrows
		    >
		      <v-tabs-slider class="blue darken-3"></v-tabs-slider>
				
		      <v-tab
		      	v-for="(data, key) in publicData"
		      	:key="key"
		      	:href="`#${key}`"
		      	:class="bgColor[key]"
		      >
		        {{tabKeys[key]}}
		      </v-tab>

		      <v-tab-item
		      	v-for="(result, key) in publicData"
		      	:key="key"
		      	:value="key"
		      >
		        <v-card
		          flat
		          tile
		          class="px-3"
		        >
		          	<v-row>
	                	<v-expansion-panels
							flat
						>
							<!-- Business Information -->
							<!-- Manual information -->
	                    	<public-data-panel-item-pre
								:data="result.business_observations"
								:mode="mode"
	                    	/>

	                    	<public-data-panel-item-pre
								:data="result.email_provider"
								:mode="mode"
	                    	/>

	                    	<public-data-panel-item-pre
								:data="result.name_associated"
								:mode="mode"
	                    	/>

	                    	<public-data-panel-item-pre
								:data="result.website_type"
								:mode="mode"
	                    	/>

	                    	<public-data-panel-item-pre
								:data="result.business_geo"
								:mode="mode"
	                    	/>
	
							<public-data-panel-item-pre
								:data="result.business_google_search_results"
								:mode="mode"
	                    	/>

	                    	<public-data-panel-item-pre
								:data="result.business_other"
								:mode="mode"
	                    	/>

							<public-data-panel-item-pre
								:data="result.linkedin_data"
								:mode="mode"
	                    	/>

							<!-- Automation result from public_data.py -->
	                    	<public-data-panel-item-pre
								:data="result.spf_record"
								:mode="mode"
	                    	/>

				            <public-data-panel-item-pre
								:data="result.spf_dmarc"
								:mode="mode"
	                    	/>

	                    	<public-data-panel-item-pre
								:data="result.spf_record_more"
								:mode="mode"
	                    	/>

				            <public-data-panel-item-pre
								:data="result.spf_spoofing_possible"
								:mode="mode"
	                    	/>

							<v-expansion-panel
								v-if="result.ctfr_subdomain"
							>
								<v-expansion-panel-header>
									<v-row align="center">
										<div v-if="mode" class="align-self-center">
						                  <v-btn
						                    color="success"
						                    icon
						                    @click="_showUpdateDialog(result.ctfr_subdomain)"
						                  >
						                    <v-icon
						                      color="success"
						                    >
						                      mdi-pencil
						                    </v-icon>
						                  </v-btn>
						                </div>
		                    			<b class="display-2 d-block">{{result.ctfr_subdomain.question}}</b>
		                    		</v-row>
	                    		</v-expansion-panel-header>
	                    		<v-expansion-panel-content>
				                    <div class="d-flex flex-wrap">
										<div v-for="domain in split(result.ctfr_subdomain.answer)">
											<v-chip outlined class="secondary ma-2 pa-2 mb-3 text--secondary">{{domain}}</v-chip>
										</div>
									</div>
								</v-expansion-panel-content>
							</v-expansion-panel>
							<v-expansion-panel
								v-if="result.builtwith"
							>
								<v-expansion-panel-header>
									<v-row align="center">
	                    				<div v-if="mode" class="align-self-center">
						                  <v-btn
						                    color="success"
						                    icon
						                    @click="_showUpdateDialog(result.builtwith)"
						                  >
						                    <v-icon
						                      color="success"
						                    >
						                      mdi-pencil
						                    </v-icon>
						                  </v-btn>
						                </div>
	                    				<b class="display-2 d-block">{{result.builtwith.question}}</b>
						            </v-row>
	                    		</v-expansion-panel-header>
	                    		<v-expansion-panel-content>
	                    			<vue-friendly-iframe
										className="iframe"
										:src="builtWithLink" 
										allow="Allow"
										name="builtWith"
										crossorigin="any"
									>
									</vue-friendly-iframe>
	                    		</v-expansion-panel-content>
	                    	</v-expansion-panel>

							<v-expansion-panel
								v-if="result.dnstwist"
							>
								<v-expansion-panel-header>
									<v-row  align="center">
	                					<div v-if="mode" class="align-self-center">
						                  <v-btn
						                    color="success"
						                    icon
						                    @click="_showUpdateDialog(result.dnstwist)"
						                  >
						                    <v-icon
						                      color="success"
						                    >
						                      mdi-pencil
						                    </v-icon>
						                  </v-btn>
						                </div>
	                					<b class="display-2 d-block">{{result.dnstwist.question}}</b>
						            </v-row>
	                			</v-expansion-panel-header>
	                			<v-expansion-panel-content>
							      	<v-data-table
								        :headers="dnstwistHeaders"
								        :items="parse_array(result.dnstwist)"
								        :items-per-page="page"
								        item-key="domain-name"
								        @update:items-per-page="getPageNum"
							      	>
								    </v-data-table>
								</v-expansion-panel-content>
							</v-expansion-panel>

							<public-data-shodan
								:data="result.shodan"
								:mode="mode"
							/>

							<public-data-whoxy
								:data="result.whoxy_history"
								:mode="mode"
							/>

							<public-item-hibp 
								:data="result.business_hibp"
								:mode="mode"
							/>

							<v-expansion-panel
								v-if="result.ssllabs"
							>
								<v-expansion-panel-header>
									<v-row  align="center">
	                					<div v-if="mode" class="align-self-center">
						                  <v-btn
						                    color="success"
						                    icon
						                    @click="_showUpdateDialog(result.dnstwist)"
						                  >
						                    <v-icon
						                      color="success"
						                    >
						                      mdi-pencil
						                    </v-icon>
						                  </v-btn>
						                </div>
	                					<b class="display-2 d-block">{{result.ssllabs.question}}</b>
						            </v-row>
	                			</v-expansion-panel-header>
	                			<v-expansion-panel-content>
				                	<div class="mb-3">Assessed on:  {{beautifyDateTime(get_json(result.ssllabs).last_update)}}</div>
							      	<v-data-table
								        :headers="ssllabsHeaders"
								        :items="parse_array(result.ssllabs).endpoints"
								        :items-per-page="page"
								        item-key="Email"
								        @update:items-per-page="getPageNum"
							      	>
							      		<template v-slot:item.no="{ item }">
						                   <div class="body-1 font-weight-bold">{{get_json(result.ssllabs).endpoints.indexOf(item) + 1}}</div>
						                </template>
							      		<template v-slot:item.grade="{ item }">
						                   <div class="display-3 font-weight-bold" :class="determinGrateClass(item.grade)">{{item.grade}}</div>
						                </template>
								    </v-data-table>
								</v-expansion-panel-content>
							</v-expansion-panel>

							<public-data-panel-item
								:data="result.wpscan"
								:mode="mode"
	                    	/>
	                		
	                		<public-item-urlscan
								:data="result.urlscan"
								:mode="mode"
	                		/>

	                		<!-- Personal data -->
	                		<!-- Manual data -->
							<!-- <public-data-panel-item-pre
								:data="result.email"
								:mode="mode"
	                		/> -->

	                		<public-data-panel-item-pre
								:data="result.personal_geo"
								:mode="mode"
	                		/>

	                		<public-data-panel-item-pre
								:data="result.personal_observations"
								:mode="mode"
	                		/>

	                		<public-data-panel-item-pre
								:data="result.facebook"
								:mode="mode"
	                		/>

	                		<public-data-panel-item-pre
								:data="result.instagram"
								:mode="mode"
	                		/>

	                		<public-data-panel-item-pre
								:data="result.twitter"
								:mode="mode"
	                		/>

	                		<public-data-panel-item-pre
								:data="result.other_social_media"
								:mode="mode"
	                		/>

	                		<public-data-panel-item-pre
								:data="result.personal_google_search_results"
								:mode="mode"
	                		/>

	                		<public-data-panel-item-pre
								:data="result.images"
								:mode="mode"
	                		/>
						</v-expansion-panels>
		            </v-row>
		        </v-card>
		      </v-tab-item>
		    </v-tabs>
  		</div>
	  </v-card>
	  <update-answer-dialog 
		v-if="mode"
		:loading="updateLoading"
		@update-answer="updateItem"
	  />
	</div>
</template>

<script>
	import { BASE_API, fetchPublicData, getCompanyId } from '../../../api'
	import { 
		validEmail,
		get_json,
		parse_array,
		beautifyEmail,
		beautifyDate,
		beautifyDuration,
		beautifyDateTimeFromUnix,
		beautifyDateTime,
		removeQuotes
	} from '../../../util'
	import axios from 'axios'
	import { mapState, mapActions } from 'vuex';

	export default {
		name: 'DashboardPublicCommonData',

		data: () => ({
			updateDialog: false,
			updateLoading: false,
			loading: false,
			bgColor: {
				high: 'red accent-3',
				medium: 'orange accent-3',
				low: 'green accent-3'
			},
			tabKeys: {
				high: 'High Risk',
				medium: 'Medium Risk',
				low: 'Low Risk'
			},
			ssllabsHeaders : [
				{
		          value: 'no',
		          text: '',
		          align: 'center',
		          class: 'font-weight-bold'
		        },
		        {
		          value: 'ipAddress',
		          text: 'Server',
		        },
		        {
		          value: 'grade',
		          text: 'Grade',
		          align: 'center',
		        },
			],
			dnstwistHeaders: [
		        {
		          value: 'fuzzer',
		          text: 'Fuzzer',
		        },
		        {
		          value: 'domain-name',
		          text: 'Domain',
		        },
		        {
		          value: 'dns-a',
		          text: 'Ip Address',
		        },
		        {
		          value: 'dns-aaaa',
		          text: 'AAAA',
		        },
		        {
		          value: 'dns-mx',
		          text: 'MX',
		        },
		        {
		          value: 'dns-ns',
		          text: 'NS',
		        },
	        ]
		}),

		async mounted () {
			await this.loadData()
	    },

	    watch: {
	    	async company () {
	    		await this.loadData()
	    	}
	    },

	    computed: {
	    	...mapState('publicdata', {
	    		publicData: state => state.publicData
	    	}),
			page () {
		        return Number(localStorage.getItem('page')) || 5
	      	}, 

	      	builtWithLink () {
	      		if (this.publicData.high.domain) {
		      		return 'https://builtwith.com/' + removeQuotes(this.publicData.high.domain.answer)
	      		} else {
	      			return ''
	      		}
	      	}
		},

		components: {
	      PublicDataPanelItemPre: () => import('../component/PublicItemPre'),
	      PublicDataPanelItem: () => import('../component/PublicItem'),
	      PublicDataShodan: () => import('../component/PublicItemShodan'),
	      PublicDataWhoxy: () => import('../component/PublicItemWhoxy'),
	      PublicItemUrlscan: () => import('../component/PublicItemUrlscan'),
	      PublicItemHibp: () => import('../component/PublicItemHibp'),
	      UpdateAnswerDialog: () => import('./UpdateAnswerDialog'),
	    },

	    methods: {
	    	...mapActions('publicdata', ['getPublicData', 'updateAnswer', 'updateComponentKey', 'setPublicItem', 'showUpdateAnswerDialog', 'setStaticField']),

	    	removeQuotes,

	    	get_json,

	    	parse_array,

	    	beautifyDuration,

	    	beautifyDateTimeFromUnix,

	    	beautifyDateTime,

	    	beautifyDate,

			beautifyEmail,

			showUpdateDialog (data) {
				this.setPublicItem(data)
				this.setStaticField(false)
	    		this.showUpdateAnswerDialog(true)
	    	},

	    	_showUpdateDialog (data) {
	    		this.setStaticField(true)
	    		this.setPublicItem(data)
	    		this.showUpdateAnswerDialog(true)
	    	},

			async updateItem (item) {
				this.updateLoading = true
				await this.updateAnswer(item)
				this.updateLoading = false

				this.showUpdateAnswerDialog(false)
				this.updateComponentKey()
			},

			determinGrateClass (grade) {
				let color = 'black'
				switch (grade) {
					case 'A':
						color = 'success'
						break
					case 'B':
						color = 'orange'
						break
					case 'C':
						color = 'purple'
						break
					default:
						color = 'red'
						break
				}

				return color + '--text'
			},

			getPageNum (_page) {
		        localStorage.setItem('page', _page)
	      	},

	      	async loadData() {
	      		let company_id = getCompanyId()
				if (this.company) {
					company_id = this.company
				}
				this.loading = true
				await this.getPublicData({company_id, category: this.category})
				this.loading = false
	      	},

			split (data) {
				if (data) {
					return data.split(';') 
				}
				return []
			},
	    },

	    props: {
	      title: {
	        type: String,
	        default: 'Personal Data'
	      },
	      category: {
	      	type: String,
	      	default: 'business'
	      },
	      banner: {
	      	type: Boolean,
	      	default: true
	      },
	      company: {
	      	type: String,
	      	default: ''
	      },
	      mode: {
	      	type: Boolean,
	      	default: false
	      }
	  	}	
	}
</script>

<style type="text/css">
	.iframe {
		width: 100%;
		min-height: calc(100vh - 180px);
	}

	.whoxy-block span {
		color: rgba(0, 0, 0, 0.6) !important;
	}

	.whoxy-date {
		position: absolute;
		top: 10px;
		right: 10px;
	}

	pre.pre-strim {
        overflow-x: auto;
        white-space: pre-line;
        white-space: -moz-pre-wrap;
        white-space: -pre-wrap;
        white-space: -o-pre-wrap;
        word-wrap: break-word;
        color: rgba(0, 0, 0, 0.6) !important;
 	}

 	.fingerprint {
 		word-break: break-all;
 	}

 	.hibp-brand {
	    border-radius: 10px;
	    border: 2px solid #3c3c3c !important;
	    font-size: 1.4em;
	    padding: 4px 8px 7px;
	    margin: 7px;
	    font-weight: 700;
	    height: auto;
	}

	img {
		width: 100%;
		height: auto;
	}

	.show-btns {
	  color: rgba(255, 255, 255, 1) !important;
	}

</style>