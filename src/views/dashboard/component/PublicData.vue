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
  	  	  v-if="!loading"
      	>
	      	<v-row>
	            <v-col
	              cols="12"
	              sm="6"
	              md="6"
	            >
	                <b class="mr-2">Domain:</b>
	                <span class="display-1">Apple.com</span>
	            </v-col>
	            <v-col
	              cols="12"
	              sm="6"
	              md="6"
	            >
	                <b class="mr-2">IP:</b>
	                <span class="display-1">3.15.67.2</span>
	            </v-col>
	        </v-row>
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
		                <v-col
		                  v-if="result.spf_record"
		                  cols="12"
		                >
		                    <b class="display-2 d-block mb-1">{{result.spf_record.question}}</b>
		                    <div class="text--secondary">{{result.spf_record.answer}}</div>
		                </v-col>
		                <v-col
		                  v-if="result.spf_dmarc"
		                  cols="12"
		                >
		                    <b class="display-2 d-block mb-1">{{result.spf_dmarc.question}}</b>
		                    <div class="text--secondary">{{result.spf_dmarc.answer}}</div>
		                </v-col>
	  					<v-col
		                  v-if="result.spf_record_more"
		                  cols="12"
		                  sm="6"
		                  md="6"
		                >
		                    <b class="display-2 d-block mb-1">{{result.spf_record_more.question}}</b>
		                    <div class="text--secondary">{{result.spf_record_more.answer}}</div>
		                </v-col>
		                <v-col
		                  v-if="result.spf_spoofing_possible"
		                  cols="12"
		                  sm="6"
		                  md="6"
		                >
		                    <b class="display-2 d-block mb-1">{{result.spf_spoofing_possible.question}}</b>
		                    <div class="text--secondary">{{result.spf_spoofing_possible.answer}}</div>
		                </v-col>
		                <v-col
		                  v-if="result.ctfr_subdomain"
		                  cols="12"
		                  sm="6"
		                  md="6"
		                >
		                  <!-- <v-card shaped outlined class="my-0 pa-2"> -->
		                    <b class="display-2 d-block mb-1">{{result.ctfr_subdomain.question}}</b>
		                    <div class="d-flex flex-wrap">
								<div v-for="domain in result.ctfr_subdomain.answer.split(';')">
									<v-chip outlined class="secondary ma-2 pa-2 mb-3 text--secondary">{{domain}}</v-chip>
								</div>
							</div>
		                  <!-- </v-card> -->
		                </v-col>
		                <v-col
		                  v-if="result.dnstwist"
		                  cols="12"
		                >
		                	<b class="display-2 d-block mb-1">{{result.dnstwist.question}}</b>
					      	<v-data-table
						        :headers="dnstwistHeaders"
						        :items="data.dnstwist.answer"
						        :items-per-page="page"
						        item-key="domain-name"
						        @update:items-per-page="getPageNum"
					      	>
						    </v-data-table>
			            </v-col>
			            <v-col
		                  v-if="result.hibp"
		                  cols="12"
		                >
		                	<b class="display-2 d-block mb-1">{{result.hibp.question}}</b>
		                	<v-data-table
						        :headers="hibpHeaders"
						        :items="result.hibp.answer"
						        :items-per-page="page"
						        item-key="Email"
						        @update:items-per-page="getPageNum"
					      	>
					      		<template v-slot:item.Email="{ item }">
				                  <span v-html="beautifyEmail(item.Email)"></span>
				                </template>
						    </v-data-table>
			            </v-col>
		                <v-col
		                  v-if="result.ssllabs"
		                  cols="12"
		                >
		                	<b class="display-2 d-block mb-1">{{result.ssllabs.question}}</b>
		                	<div class="title mb-3">Assessed on:  {{beautifyDateTime(result.ssllabs.answer.last_update)}}</div>
					      	<v-data-table
						        :headers="ssllabsHeaders"
						        :items="result.ssllabs.answer.endpoints"
						        :items-per-page="page"
						        item-key="Email"
						        @update:items-per-page="getPageNum"
					      	>
					      		<template v-slot:item.no="{ item }">
				                   <div class="body-1 font-weight-bold">{{result.ssllabs.answer.endpoints.indexOf(item) + 1}}</div>
				                </template>
					      		<template v-slot:item.grade="{ item }">
				                   <div class="display-3 font-weight-bold" :class="determinGrateClass(item.grade)">{{item.grade}}</div>
				                </template>
				                <!-- <template v-slot:item.details="{ item }">
				                   <div class="body-1">{{beautifyDateTimeFromUnix(item.details.hostStartTime)}}</div>
				                   <div class="body-2">Duration: {{beautifyDuration(item.duration)}}</div>
				                </template> -->
						    </v-data-table>
			            </v-col>
			            <v-col
		                  v-if="result.wpscan"
		                  cols="12"
		                >
		                	<b class="display-2 d-block mb-1">{{result.wpscan.question}}</b>
		                	<template>
								<pre>
									{{result.wpscan.answer}}
								</pre>
							</template>
			            </v-col>

			            <v-col
		                  v-if="result.urlscan"
		                  cols="12"
		                >
		                	<b class="display-2 d-block mb-1">{{result.urlscan.question}}</b>
		                	<v-row>
				              	<v-col
				                  	cols="12"
				                  	md="6"
				              	>
				              		<b>Country:</b> <span>{{get_urlscan().urlscan_country}}</span>
				              	</v-col>
								<v-col
				                  	cols="12"
				                  	md="6"
				              	>
					              	<b>IP Address:</b> <span>{{get_urlscan().urlscan_ip_address}}</span>
				              	</v-col>
								<v-col
				                  	cols="12"
				                  	md="6"
				              	>
					              	<b>IPV6:</b> <span>{{get_urlscan().urlscan_ipv6}}</span>
				              	</v-col>
				              	<v-col
				                  	cols="12"
				                  	class="d-flex align-center"
				              	>
				              		<b>Web Apps:</b> 
				              		<span class="d-flex flex-wrap">
										<span v-for="app in get_urlscan().urlscan_web_apps.split(';')">
											<v-chip outlined class="secondary ma-2 pa-2 mb-3">{{app}}</v-chip>
										</span>
									</span>
				              	</v-col>
				              	<v-col
				                  	cols="12"
				                  	md="6"
				              	>
				              		<b>Server:</b> <span>{{get_urlscan().urlscan_server}}</span>
				              	</v-col>
				              	<v-col
				                  	cols="12"
				                  	md="6"
				              	>
				              		<b>Number of Requests:</b> <span>{{get_urlscan().urlscan_number_of_requests}}</span>
				              	</v-col>
				              	<v-col
				                  	cols="12"
				                  	md="6"
				              	>
				              		<b>Ads Blocked:</b> 
				              		<v-chip outlined class="ma-2 mb-3" :color="get_urlscan().urlscan_ads_blocked == 1 ? 'green' : 'black'" >{{get_urlscan().urlscan_ads_blocked == 1 ? 'YES' : 'No'}}</v-chip>
				              	</v-col>
				              	<v-col
				                  	cols="12"
				                  	md="6"
				              	>
				              		<b>HTTP Requests:</b> <span>{{get_urlscan().urlscan_http_requests}}</span>
				              	</v-col>
				              	<v-col
				                  	cols="12"
				                  	md="6"
				              	>
				              		<b>Unique Country Counts:</b> <span>{{get_urlscan().urlscan_unique_country}}</span>
				              	</v-col>
				              	<v-col
				                  	cols="12"
				                  	md="6"
				              	>
				              		<b>Malicious Requests:</b> <span>{{get_urlscan().urlscan_malicious_requests}}</span>
				              	</v-col>
				              	<v-col
				                  	cols="12"
				                  	class="d-flex"
				              	>
				              		<b>Pointed Domains:</b> 
				              		<span class="d-flex flex-wrap">
										<span v-for="domain in get_urlscan().urlscan_pointed_domains.split(';')">
											<v-chip outlined class="secondary ma-2 pa-2 mb-3">{{domain}}</v-chip>
										</span>
									</span>
				              	</v-col>
							</v-row>
			            </v-col>

		                <v-col
		                  v-if="result.whoxy_history"
		                  cols="12"
		                >
		                  <!-- <v-card shaped outlined class="my-0 pa-2"> -->
		                    <b class="display-2 d-block mb-1">{{result.whoxy_history.question}}</b>
		                    <div v-for="item in JSON.parse(result.whoxy_history.answer)" :key="item.num">
								<v-row>
					                <v-col
					                  cols="12"
					                >
					                  <v-card shaped outlined class="my-0 pa-4 p-relative whoxy-block">
					                  	<v-chip class="whoxy-date secondary mb-2">{{beautifyDate(item.registrant_contact.query_time)}}</v-chip>
					                    <div class="mb-2"><b>Owner:</b> <span>{{item.registrant_contact.full_name}}</span></div>
					                    <div class="mb-2"><b>Company:</b> <span>{{item.administrative_contact.company_name}}</span></div>
					                    <div class="mb-2"><b>Domain:</b> <span>{{item.domain_registrar.registrar_name}}</span></div>
					                    <div class="mb-2"><b>Geolocation:</b> <span>{{item.registrant_contact.city_name}}, {{item.registrant_contact.state_name}} {{item.registrant_contact.zip_code}}, {{item.registrant_contact.country_name}}</span></div>
					                    <div class="mb-2"><b>Email:</b> <span>{{item.administrative_contact.email_address}}</span></div>
					                    <div class="mb-2"><b>Phone:</b> <span>{{item.administrative_contact.phone_number}}</span></div>
					                    <div class="mb-2"><b>Email:</b> <span v-html="beautifyEmail(item.administrative_contact.email_address)"></span></div>
					                    <div class="mb-2"><b>Nameservers:</b> <span>{{item.name_servers.join(', ')}}</span></div>
					                    <div class="mb-2"><b>Status:</b> <span>{{item.domain_status[0]}}</span></div>
					                  </v-card>
					                </v-col>
					            </v-row>
							</div>
		                  <!-- </v-card> -->
		                </v-col>
		                
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
	import { validEmail } from '../../../util'
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

	    methods: {
	    	get_urlscan () {
	    		return JSON.parse(result.urlscan.answer)
	    	},
	    	beautifyDuration (duration) {
				return this.$moment(duration, 'x').format('HH:mm:ss')
			},
			beautifyDateTimeFromUnix (timestamp) {
				return this.$moment(timestamp, 'x').format('DD MMM YYYY, HH:mm:ss')
			},

			beautifyDateTime (date) {
				return this.$moment(date).format('DD MMM YYYY, HH:mm:ss')
			},

			beautifyDate (date) {
				return this.$moment(date).format('DD MMM YYYY')
			},

			beautifyDateZ (date) {
				return this.$moment(date, 'YYYYMMDDHHmmss').format('MMM DD YYYY HH:mm:ss')
			},

			beautifyEmail (email) {
				if (validEmail(email)) {
		            return `<a href="mailto:${email}">${email}</a>`
	          	} else {
		            return `${email}`
	          	}
			},
			async fetchData () {
				this.loading = true
				const res = await axios.get(`${BASE_API}/api/public/${getCompanyId()}/${this.category}`)
				this.publicData = {
					high: res.data.data.high,
					medium: res.data.data.medium,
					low: res.data.data.low
				};
				this.loading = false
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
	.whoxy-block span {
		color: rgba(0, 0, 0, 0.6) !important;
	}

	.whoxy-date {
		position: absolute;
		top: 10px;
		right: 10px;
	}
</style>