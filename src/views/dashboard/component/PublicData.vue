<template>
	<v-container
	    id="public-common-data"
	    fluid
	    tag="section"
	  >
	  <blockquote class="blockquote">Below is the data we found on your business.</blockquote>

	  <v-card
  	  	:loading="loading"
	  	class="px-5 py-3"
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
		                <b class="mr-2">Domain:</b>
		                <span class="display-1">{{publicData.high.domain.answer}}</span>
		            </v-col>
		            <v-col
		              v-if="publicData.high.website_ip"
		              cols="12"
		              sm="6"
		              md="6"
		            >
		                <b class="mr-2">IP:</b>
		                <span class="display-1">{{publicData.high.website_ip.answer}}</span>
		            </v-col>
		        </v-row>
		    </div>

		    <!-- General Personal Data -->
		    <div
				v-if="category=='personal'"
		    >
		    	<v-row>
		            <v-col
		              v-if="publicData.high.name"
		              cols="12"
		              sm="6"
		              md="4"
		            >
		                <b class="mr-2">Name:</b>
		                <span class="display-1">{{publicData.high.name.answer}}</span>
		            </v-col>
		            <v-col
		              v-if="publicData.high.email"
		              cols="12"
		              sm="6"
		              md="4"
		            >
		                <b class="mr-2">Email:</b>
		                <span class="display-1">{{beautifyEmail(publicData.high.email.answer)}}</span>
		            </v-col>
		            <v-col
		              v-if="publicData.high.dob"
		              cols="12"
		              sm="6"
		              md="4"
		            >
		                <b class="mr-2">Birthday:</b>
		                <span class="display-1">{{publicData.high.dob.answer}}</span>
		            </v-col>
		        </v-row>
		    </div>
	      	<v-tabs
		      class="elevation-2 mt-4"
		      dark
		      centered
		      grow
		    >
		      <v-tabs-slider class="blue darken-3"></v-tabs-slider>
				
		      <v-tab
		      	v-for="(data, key) in publicData"
		      	:key="key"
		      	:href="`#${key}`"
		      	:class="bgColor[key]"
		      >
		        {{key}}
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
								:data="result.observations"
	                    	/>

	                    	<public-data-panel-item-pre
								:data="result.email_provider"
	                    	/>

	                    	<public-data-panel-item-pre
								:data="result.name_associated"
	                    	/>

	                    	<public-data-panel-item-pre
								:data="result.website_type"
	                    	/>

	                    	<public-data-panel-item-pre
								:data="result.business_geo"
	                    	/>
	
							<public-data-panel-item-pre
								:data="result.business_google_search_results"
	                    	/>

	                    	<public-data-panel-item-pre
								:data="result.business_other"
	                    	/>

							<public-data-panel-item-pre
								:data="result.linkedin_data"
	                    	/>

							<!-- Automation result from public_data.py -->
	                    	<public-data-panel-item-pre
								:data="result.spf_record"
	                    	/>

				            <public-data-panel-item-pre
								:data="result.spf_dmarc"
	                    	/>

	                    	<public-data-panel-item-pre
								:data="result.spf_record_more"
	                    	/>

				            <public-data-panel-item-pre
								:data="result.spf_spoofing_possible"
	                    	/>

							<v-expansion-panel
								v-if="result.ctfr_subdomain"
							>
								<v-expansion-panel-header>
	                    			<b class="display-2 d-block">{{result.ctfr_subdomain.question}}</b>
	                    		</v-expansion-panel-header>
	                    		<v-expansion-panel-content>
				                    <div class="d-flex flex-wrap">
										<div v-for="domain in result.ctfr_subdomain.answer.split(';')">
											<v-chip outlined class="secondary ma-2 pa-2 mb-3 text--secondary">{{domain}}</v-chip>
										</div>
									</div>
								</v-expansion-panel-content>
							</v-expansion-panel>
							<v-expansion-panel
								v-if="result.builtwith"
							>
								<v-expansion-panel-header>
	                    			<b class="display-2 d-block">{{result.builtwith.question}}</b>
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
	                				<b class="display-2 d-block">{{result.dnstwist.question}}</b>
	                			</v-expansion-panel-header>
	                			<v-expansion-panel-content>
							      	<v-data-table
								        :headers="dnstwistHeaders"
								        :items="get_json(result.dnstwist)"
								        :items-per-page="page"
								        item-key="domain-name"
								        @update:items-per-page="getPageNum"
							      	>
								    </v-data-table>
								</v-expansion-panel-content>
							</v-expansion-panel>

							<public-data-shodan
								:data="result.shodan"
							/>

							<public-data-whoxy
								:data="result.whoxy_history"
							/>

							<v-expansion-panel
								v-if="result.hibp"
							>
								<v-expansion-panel-header>
	                				<b class="display-2 d-block">{{result.hibp.question}}</b>
	                			</v-expansion-panel-header>
	                			<v-expansion-panel-content>
				                	<v-data-table
								        :headers="hibpHeaders"
								        :items="get_json(result.hibp)"
								        :items-per-page="page"
								        item-key="Email"
								        @update:items-per-page="getPageNum"
							      	>
							      		<template v-slot:item.Email="{ item }">
						                  <span v-html="beautifyEmail(item.Email)"></span>
						                </template>
								    </v-data-table>
								</v-expansion-panel-content>
							</v-expansion-panel>

							<v-expansion-panel
								v-if="result.ssllabs"
							>
								<v-expansion-panel-header>
	                				<b class="display-2 d-block">{{result.ssllabs.question}}</b>
	                			</v-expansion-panel-header>
	                			<v-expansion-panel-content>
				                	<div class="mb-3">Assessed on:  {{beautifyDateTime(get_json(result.ssllabs).last_update)}}</div>
							      	<v-data-table
								        :headers="ssllabsHeaders"
								        :items="get_json(result.ssllabs).endpoints"
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
						                <!-- <template v-slot:item.details="{ item }">
						                   <div class="body-1">{{beautifyDateTimeFromUnix(item.details.hostStartTime)}}</div>
						                   <div class="body-2">Duration: {{beautifyDuration(item.duration)}}</div>
						                </template> -->
								    </v-data-table>
								</v-expansion-panel-content>
							</v-expansion-panel>

							<public-data-panel-item-pre
								:data="result.wpscan"
	                    	/>
	                		
	                		<public-item-urlscan
								:data="result.urlscan"
	                		/>

	                		<!-- Personal data -->
	                		<!-- Manual data -->
							<public-data-panel-item-pre
								:data="result.email"
	                		/>

	                		<public-data-panel-item-pre
								:data="result.personal_geo"
	                		/>

	                		<public-data-panel-item-pre
								:data="result.facebook"
	                		/>

	                		<public-data-panel-item-pre
								:data="result.instagram"
	                		/>

	                		<public-data-panel-item-pre
								:data="result.twitter"
	                		/>

	                		<public-data-panel-item-pre
								:data="result.other_social_media"
	                		/>

	                		<public-data-panel-item-pre
								:data="result.personal_google_search_results"
	                		/>

	                		<public-data-panel-item-pre
								:data="result.images"
	                		/>
						</v-expansion-panels>
		            </v-row>
		        </v-card>
		      </v-tab-item>
		    </v-tabs>
  		</div>
	  </v-card>
	</v-container>
</template>

<script>
	import { BASE_API, fetchPublicData, getCompanyId } from '../../../api'
	import { validEmail, get_json, beautifyEmail, beautifyDate, beautifyDuration, beautifyDateTimeFromUnix, beautifyDateTime } from '../../../util'
	import axios from 'axios'

	export default {
		name: 'DashboardPublicCommonData',

		data: () => ({
			loading: false,
			bgColor: {
				high: 'red accent-3',
				medium: 'orange accent-3',
				low: 'green accent-3'
			},
			publicData: {
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
			await this.fetchData()
	    },

	    computed: {
			page () {
		        return Number(localStorage.getItem('page')) || 5
	      	}, 

	      	builtWithLink () {
	      		if (this.publicData) {
		      		return 'https://builtwith.com/' + this.publicData.high.domain.answer
	      		} else {
	      			return ''
	      		}
	      	}
		},

		components: {
	      PublicDataPanelItemPre: () => import('../component/PublicItemPre'),
	      PublicDataShodan: () => import('../component/PublicItemShodan'),
	      PublicDataWhoxy: () => import('../component/PublicItemWhoxy'),
	      PublicItemUrlscan: () => import('../component/PublicItemUrlscan'),
	    },

	    methods: {
	    	get_json,

	    	beautifyDuration,

	    	beautifyDateTimeFromUnix,

	    	beautifyDateTime,

	    	beautifyDate,

			beautifyEmail,

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

			hexEncode (str) {
			    var hex, i;

			    var result = "";
			    for (i=0; i < str.length; i++) {
			        hex = str.charCodeAt(i).toString(16);
			        result += (":"+hex).slice(-4);
			    }

			    return result.slice(1, result.length-2)
			},
			async fetchData () {
				this.loading = true
				const res = await axios.get(`${BASE_API}/api/public/${getCompanyId()}/${this.category}`)
				this.loading = false
				this.publicData = {
					high: res.data.data.high,
					medium: res.data.data.medium,
					low: res.data.data.low
				};
			}
	    },

	    props: {
	      title: {
	        type: String,
	        default: 'Personal Data'
	      },
	      category: {
	      	type: String,
	      	default: 'Public Data - Business'
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
</style>