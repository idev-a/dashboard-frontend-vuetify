<template>
	<v-container
	    id="public-data"
	    fluid
	    tag="section"
	  >
	  	<v-select
	  	  v-model="service"
	  	  chips
	  	  :disabled="loading"
          :items="services"
          label="Select a Service"
          hint="Display 3rd party result"
          @input="changeService"
        ></v-select>

	    <v-card
			:loading="loading"
	      	class="px-5 py-3 iframe"
	    >
			<vue-friendly-iframe
				v-if="isIframe"
				className="iframe"
				:src="serviceLink" 
				@iframe-load="onLoad"
				allow="Allow"
				name="builtWith"
				crossorigin="any"
			>
			</vue-friendly-iframe>
			
			<div v-if="select['ssllabs']" id="scrapedPage">
				<v-card-title><img src="https://ssllabs.com/images/qualys-ssl-labs-logo.png" width="341" height="55" alt="SSL Labs logo" title="SSL Labs logo"></v-card-title>
				<div class="display-2">SSL Report: {{ company }}</div>
				<div class="title mb-3">Assessed on:  {{beautifyDateTime(data.ssllabs.last_update)}}</div>
				<!-- <v-tabs
			      background-color=""
			      class="elevation-1"
			      grow
			    >
			      <v-tabs-slider></v-tabs-slider>

			      <v-tab
			        href="#tab-0"
			      >
			        Server Test
			      </v-tab>

			      <v-tab-item
			        value="tab-0"
			        class="pt-3"
			      > -->
			        <!-- <v-card-title>
			        <v-text-field
			          v-model="search"
			          append-icon="mdi-magnify"
			          label="Search"
			          class="mb-3"
			          single-line
			          hide-details
			        ></v-text-field>
			        <v-spacer></v-spacer>
			      	</v-card-title> -->
			      	<v-data-table
				        :loading="loading"
				        :headers="ssllabsHeaders"
				        :items="data.ssllabs.endpoints"
				        :items-per-page="page"
				        item-key="Email"
				        :search="search"
				        @update:items-per-page="getPageNum"
			      	>
			      		<template v-slot:item.no="{ item }">
		                   <div class="body-1 font-weight-bold">{{data.ssllabs.endpoints.indexOf(item) + 1}}</div>
		                </template>
			      		<template v-slot:item.grade="{ item }">
		                   <div class="display-3 font-weight-bold" :class="determinGrateClass(item.grade)">{{item.grade}}</div>
		                </template>
		                <template v-slot:item.details="{ item }">
		                   <div class="body-1">{{beautifyDateTimeFromUnix(item.details.hostStartTime)}}</div>
		                   <!-- <div class="body-2">Duration: {{beautifyDuration(item.duration)}}</div> -->
		                </template>
				    </v-data-table>
			     <!--  </v-tab-item>
			      <v-tab
			        href="#tab-1"
			      >
			        Certificates
			      </v-tab>

			      <v-tab-item
			        value="tab-1"
			      >
			      	
			      </v-tab-item>
			    </v-tabs> -->
				
			</div>

			<div v-if="select['whoxy']" class="overflow-y">
				<v-card-title><img src="https://www.whoxy.com/images/logo.png" width="300" height="100" alt="Whoxy.com"></v-card-title>
				<div v-for="item in data.whoxy" :key="item.num">
					<v-row>
		                <v-col
		                  cols="12"
		                >
		                  <v-card shaped outlined class="my-0 pa-4 p-relative">
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
			</div>

			<div v-if="select['spoofcheck']" class="overflow-y py-4 pa-4">
				<v-card-title>Spoof Check</v-card-title>
			 	<v-sheet
			 		class="pa-3 py-4 my-3"
			        color="info"
		      	>
		      		{{data.spf_record}}
		      	</v-sheet>
				<div class="mb-2"><span>{{data.spf_record_more}}</span></div>
				<div class="mb-3"><b>dmarc:</b> <span>{{data.spf_dmarc}}</span></div>
				<div class="mb-2" v-html="checkSPFPossible(data.spf_spoofing_possible)"></div>
			</div>

			<div v-if="select['ctfr']" class="overflow-y py-4 pa-4">
				<v-card-title>CTFR (Sub domains)</v-card-title>
				<div class="d-flex flex-wrap">
					<div v-for="domain in data.ctfr_subdomain.split(';')">
						<v-chip outlined class="secondary ma-2 pa-2 mb-3">{{domain}}</v-chip>
					</div>
				</div>
			</div>

			<div v-if="select['urlscan']" class="overflow-y py-4 pa-4">
				<v-card-title><span class="mr-2">Urlscan.io</span><img src="https://urlscan.io/img/urlscan_256.png" style="height: 50px; margin-top: -15px;"></v-card-title>
				<v-row>
					<v-col
	                  cols="12"
	                  md="6"
	              	>
	              		<b>Domain:</b> <span>{{data.urlscan_domain}}</span>
	              	</v-col>
	              	<v-col
	                  	cols="12"
	                  	md="6"
	              	>
	              		<b>Country:</b> <span>{{data.urlscan_country}}</span>
	              	</v-col>
					<v-col
	                  	cols="12"
	                  	md="6"
	              	>
		              	<b>IP Address:</b> <span>{{data.urlscan_ip_address}}</span>
	              	</v-col>
					<v-col
	                  	cols="12"
	                  	md="6"
	              	>
		              	<b>IPV6:</b> <span>{{data.urlscan_ipv6}}</span>
	              	</v-col>
	              	<v-col
	                  	cols="12"
	                  	class="d-flex align-center"
	              	>
	              		<b>Web Apps:</b> 
	              		<span class="d-flex flex-wrap">
							<span v-for="app in data.urlscan_web_apps.split(';')">
								<v-chip outlined class="secondary ma-2 pa-2 mb-3">{{app}}</v-chip>
							</span>
						</span>
	              	</v-col>
	              	<v-col
	                  	cols="12"
	                  	md="6"
	              	>
	              		<b>Server:</b> <span>{{data.urlscan_server}}</span>
	              	</v-col>
	              	<v-col
	                  	cols="12"
	                  	md="6"
	              	>
	              		<b>Number of Requests:</b> <span>{{data.urlscan_number_of_requests}}</span>
	              	</v-col>
	              	<v-col
	                  	cols="12"
	                  	md="6"
	              	>
	              		<b>Ads Blocked:</b> 
	              		<v-chip outlined class="ma-2 mb-3" :color="data.urlscan_ads_blocked == 1 ? 'green' : 'black'" >{{data.urlscan_ads_blocked == 1 ? 'YES' : 'No'}}</v-chip>
	              	</v-col>
	              	<v-col
	                  	cols="12"
	                  	md="6"
	              	>
	              		<b>HTTP Requests:</b> <span>{{data.urlscan_http_requests}}</span>
	              	</v-col>
	              	<v-col
	                  	cols="12"
	                  	md="6"
	              	>
	              		<b>Unique Country Counts:</b> <span>{{data.urlscan_unique_country}}</span>
	              	</v-col>
	              	<v-col
	                  	cols="12"
	                  	md="6"
	              	>
	              		<b>Malicious Requests:</b> <span>{{data.urlscan_malicious_requests}}</span>
	              	</v-col>
	              	<v-col
	                  	cols="12"
	                  	class="d-flex"
	              	>
	              		<b>Pointed Domains:</b> 
	              		<span class="d-flex flex-wrap">
							<span v-for="domain in data.urlscan_pointed_domains.split(';')">
								<v-chip outlined class="secondary ma-2 pa-2 mb-3">{{domain}}</v-chip>
							</span>
						</span>
	              	</v-col>
				</v-row>
			</div>

			<div v-if="select['shodan']" class="overflow-y py-4 pa-4">
				<v-card-title> <span class="mr-2">Shodan.io</span> <v-img src="https://static.shodan.io/shodan/img/logo.png" max-width="112"/></v-card-title>
				<v-row>
					<v-col
	                  cols="12"
	                  md="6"
	              	>
						<div>
							<v-icon
								large
						      size="16"
						      class="ml-2 mr-1"
						    >
						      mdi-earth
						    </v-icon>
						    <b class="display-2">{{data.shodan.ip_str}}</b>
						</div>
						<v-divider class="my-2"></v-divider>
						<div class="mb-3"><b>Country:</b> <span>{{data.shodan.country_name}}</span></div>
						<div class="mb-3"><b>Last Update:</b> <span>{{data.shodan.last_update}}</span></div>
						<v-row>
							<v-col
			                  cols="6"
			              	>
			              		<div class="mb-3"><b>ASN:</b> <span>{{data.shodan.asn}}</span></div>
			              	</v-col>
			              	<v-col
			                  cols="6"
			              	>
			              		<div class="mb-3"><b>Organization:</b> <span>{{data.shodan.org}}</span></div>
			              	</v-col>
			          	</v-row>
						<v-row>
							<v-col
			                  cols="6"
			              	>
			              		<div class="mb-3"><b>Latitude:</b> <span>{{data.shodan.latitude.toFixed(2)}}</span></div>
			              	</v-col>
			              	<v-col
			                  cols="6"
			              	>
			              		<div class="mb-3"><b>Longitude:</b> <span>{{data.shodan.longitude.toFixed(2)}}</span></div>
			              	</v-col>
			          	</v-row>
	              	</v-col>
	              	<v-col
	                  cols="12"
	                  md="6"
	              	>
	              		<div>
							<v-icon
								large
						      size="16"
						      class="ml-2 mr-1"
						    >
						      mdi-power-plug
						    </v-icon>
						    <b class="display-2">Ports ({{data.shodan.ports.length}})</b>
						</div>
						<v-divider class="my-2"></v-divider>
						<div class="d-flex flex-wrap">
							<div v-for="port in data.shodan.ports">
								<v-chip label outlined class="success ma-2 pa-2 mb-3">{{port}}</v-chip>
							</div>
						</div>
					</v-col>
				</v-row>
				<div>
					<v-icon
						large
				      size="16"
				      class="ml-2 mr-1"
				    >
				      mdi-power-plug
				    </v-icon>
				    <b class="display-2">Services ({{ data.shodan.data.length}})</b>
				</div>
				<v-divider class="my-2"></v-divider>
				<v-row>
					<v-col
						cols="12"
	                  	md="6"
	                  	v-for="service in data.shodan.data"
	                >	
	                	<div class="d-inline-flex mb-2">
	                		<v-chip label class="success pa-0 px-5">{{service.port}}</v-chip>
	                		<v-chip label class="orange pa-0 px-5">{{service.transport}}</v-chip>
	                		<v-chip label class="dark pa-0 px-5">{{service._shodan.module}}</v-chip>
	                	</div>
	                	<pre >{{service.data}}</pre>
						<div v-if="service.http && !service.ssl">
							<b class="mb-2">{{service.http.title}}</b>
							<div v-html="service.http.html"></div>
						</div>

						<div v-if="service.ssl">
							<div v-if="service.ssl">
								<div class="display-1">SSL Certificate</div>
								<div class="mb-1"><b>Version:</b> <span>{{service.ssl.cert.version}}</span></div>
								<div class="mb-1"><b>Serial Number:</b> <span>{{service.ssl.cert.serial}}</span></div>
								<div class="mb-1"><b>Signature Algorithm:</b> <span>{{service.ssl.cert.sig_alg}}</span></div>
								<div class="mb-1"><b>Issuer:</b> <span v-for="(val, name) in service.ssl.cert.issuer"><span class="ma-1">{{name}}={{val}},</span></span></div>
								<div class="mb-1">
									<b>Validity:</b> 
									<span v-if="!service.ssl.cert.expired">
										<v-icon color="success">mdi-check</v-icon>
									</span> 
									<span v-else>
										<v-icon color="red">mdi-alert</v-icon>
									</span> 
								</div>
								<div class="mb-1 ml-2"><span>Not Before:</span> {{beautifyDateZ(service.ssl.cert.issued)}} </div>
								<div class="mb-1 ml-2"><span>Not After :</span> {{beautifyDateZ(service.ssl.cert.expires)}} </div>
								<div class="mb-1"><b>Subject:</b> <span v-for="(val, name) in service.ssl.cert.subject"><span class="ma-1">{{name}}={{val}},</span></span></div>
								<div class="">
									<b>Subject Public Key Info:</b> 
									<div class="mb-1 ml-2"><span>Public-Key:</span> {{ service.ssl.cert.pubkey.type }} - {{ service.ssl.cert.pubkey.bits }} bit </div>
									<v-expansion-panels
										flat
										hover
									>
										<v-expansion-panel>
									        <v-expansion-panel-header><b>Fingerprint:</b></v-expansion-panel-header>
									        <v-expansion-panel-content>
												<div v-for="(val, name) in service.ssl.cert.fingerprint">
													<div class="fingerprint">
														<div>{{name}}:</div>
														<pre class="mb-1 ml-4 body-2">{{hexEncode(val)}} </pre>
													</div>
												</div>
									        </v-expansion-panel-content>
								      	</v-expansion-panel>
							      	</v-expansion-panels>
								</div>
								<!-- <div class="mb-1">
									<b>X509v3 extensions:</b> 
									<div class="mb-1 ml-2">
										<div v-for="item in service.ssl.cert.extensions">
											<div class="mb-1 fingerprint">
												<div>X509v3 {{item.name}}: </div>
												<div class="ml-5" v-if="item.name == 'authorityKeyIdentifier' || item.name == 'subjectKeyIdentifier'">{{hexEncode(item.data)}}</div>
												<div class="ml-5" v-else>{{item.data}}</div>
											</div>
										</div>
									</div>
								</div> -->
								<div class="mb-2">
									<v-expansion-panels
										flat
										hover
									>
										<v-expansion-panel>
									        <v-expansion-panel-header><b>Certificates:</b></v-expansion-panel-header>
									        <v-expansion-panel-content>
												<div v-for="item in service.ssl.chain">
													<pre class="body-2">{{item}}</pre>
												</div>
									        </v-expansion-panel-content>
								      	</v-expansion-panel>
							      	</v-expansion-panels>
								</div>
							</div>
						</div>
	              	</v-col>
				</v-row>
		   	</div>

			<div v-if="select['dnstwist']" class="overflow-y py-4 pa-4">
				<v-card-title> DNSTwist</v-card-title>
				<v-card-title>
			        <v-text-field
			          v-model="search"
			          append-icon="mdi-magnify"
			          label="Search"
			          class="mb-3"
			          single-line
			          hide-details
			        ></v-text-field>
			        <v-spacer></v-spacer>
		      	</v-card-title>
		      	<v-data-table
			        :loading="loading"
			        :headers="dnstwistHeaders"
			        :items="data.dnstwist"
			        :items-per-page="page"
			        item-key="domain-name"
			        :search="search"
			        @update:items-per-page="getPageNum"
		      	>
			    </v-data-table>
			</div>

			<div v-if="select['hibp']" class="overflow-y py-4 pa-4">
				<v-card-title> <span class="mr-2">Have I Been Pwned?</span> <span class="hibp-brand">';--</span></v-card-title>
				<v-card-title>
			        <v-text-field
			          v-model="search"
			          append-icon="mdi-magnify"
			          label="Search"
			          class="mb-3"
			          single-line
			          hide-details
			        ></v-text-field>
			        <v-spacer></v-spacer>
		      	</v-card-title>
		      	<v-data-table
			        :loading="loading"
			        :headers="hibpHeaders"
			        :items="data.hibp"
			        :items-per-page="page"
			        item-key="Email"
			        :search="search"
			        @update:items-per-page="getPageNum"
		      	>
		      		<template v-slot:item.Email="{ item }">
	                  <span v-html="beautifyEmail(item.Email)"></span>
	                </template>
			    </v-data-table>
			</div>

			<div v-if="select['wpscan']" class="overflow-y py-4 pa-4">
				<v-card-title> <span class="mb-2">WPScan:</span><!--  <span>{{this.company}}</span> --></v-card-title>
				<!-- <template v-if="data.wpscan.scan_aborted">
					<blockquote class="blockquote">{{data.wpscan.scan_aborted}}</blockquote>
				</template> -->
				<template>
					<pre>
						{{data.wpscan}}
					</pre>
				</template>
			</div>
		</v-card>
	</v-container>
</template>

<script>
	import { BASE_API } from '../../../api'
	import { validEmail } from '../../../util'
	import axios from 'axios'

	import JQuery from 'jquery'
	let $ = JQuery

	export default {
		name: 'DashboardPublicData',

		data () {
			return  {
				loading: false,
				serviceLink: '',
				company: '',
				isIframe: false,
				search: '',
				service: '',
				html: '',
				select: {},
				services: [
					'builtWith',
					'ssllabs',
					'crunchbase',
					'shodan',
					'spoofcheck',
					'urlscan',
					'ctfr',
					'hibp',
					'whoxy',
					'dnstwist',
					'wpscan'
				],
				links: {
					builtWith: 'https://builtwith.com/',
					ssllabs: 'https://www.ssllabs.com/ssltest/analyze.html?hideResults=on&d=',
					crunchbase: 'https://www.crunchbase.com/organization/grove',
				},
				data: {
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
			          value: 'details',
			          text: 'Test time',
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
			        // {
			        //   value: 'geoip-country',
			        //   text: 'Geoip Country',
			        // },
			        // {
			        //   value: 'whois-created',
			        //   text: 'Created By',
			        // },
			        // {
			        //   value: 'whois-updated',
			        //   text: 'Updated By',
			        // },
			        // {
			        //   value: 'ssdeep-score',
			        //   text: 'SSDeep Score',
			        // },
		        ]
			}
		},

		computed: {
			page () {
		        return Number(localStorage.getItem('page')) || 5
	      	}, 
		},

		mounted () {
			let user = {}
	        try {
	          user = JSON.parse(localStorage.getItem('user'))
	        } catch(e) {}
	        this.company = user.email.split('@')[1];

	        this.fetchData()
		},

		methods: {
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

			checkSPFPossible (possible) {
				if (possible.includes('Spoofing possible')) {
					return `<v-sheet tile="false" class="pa-1 py-2 orange">${possible}</v-sheet>`
				} else {
					return `<v-sheet tile="false" class="pa-1 py-2 success">${possible}</v-sheet>`
				}
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

			beautifyCtfr (domains) {
		        let res = ''
		        const list = domains.split(';')
		        list.map(domain => {
		            res += `<v-chip outlined class="secondary ma-2 pa-2 mb-3">${domain}</v-chip>`
		        })

		        return res
	      	},

			changeService (data) {
				this.loading = true
				this.serviceLink = this.links[data] + this.company
				if (['builtWith'].includes(data)) {
					this.isIframe = true
				} else {
					this.isIframe = false
					this.select = []
					this.select[data] = true
					switch (data) {
						case 'whoxy':
							try {
								this.data['whoxy'] = JSON.parse(this.data['whoxy'])
							} catch (e) {}
							this.data['whoxy'] = this.data['whoxy'] || {}
							this.loading = false
							break
						case 'shodan':
							try {
								this.data['shodan'] = JSON.parse(this.data['shodan'])
							} catch (e) {}
							this.data['shodan'] = this.data['shodan'] || {}
							this.loading = false
							break
						case 'dnstwist':
							try {
								this.data['dnstwist'] = JSON.parse(this.data['dnstwist'])
							} catch (e) {}
							this.data['dnstwist'] = this.data['dnstwist'] || []
							this.loading = false
							break
						// case 'wpscan':
						// 	try {
						// 		this.data['wpscan'] = JSON.parse(this.data['wpscan'])
						// 	} catch (e) {}
						// 	this.data['wpscan'] = this.data['wpscan'] || {}
						// 	this.loading = false
						// 	break
						case 'hibp':
							try {
								this.data['hibp'] = JSON.parse(this.data['hibp'])
							} catch (e) {}
							this.data['hibp'] = this.data['hibp'] || {}
							this.loading = false
							break
						case 'wpscan':
							this.data.wpscan = this.data.wpscan.trimStart()
							this.loading = false
							break
						case 'spoofcheck':
						case 'ctfr':
						case 'urlscan':
							this.loading = false
							break
						case 'ssllabs':
							try {
								this.data['ssllabs'] = JSON.parse(this.data['ssllabs'])
							} catch (e) {}
							this.data['ssllabs'] = this.data['ssllabs'] || {}
							this.loading = false
							break
					}
				}
			},
			fetchData () {
				const self = this
		        self.loading = true
		        axios(`${BASE_API}/api/public/${this.company}/data`, {
		            method: 'GET',
		          })
		            .then(function (res) {
		              self.data = res.data.data
		            })
		            .catch(error => {
		              console.log(error)
		            })
		            .finally(() => {
		              self.loading = false
		            })
			},
			fetchPage (data) {
				const url = this.links[data] + this.company
				const segs = url.split('/')
				const hostname = `${segs[0]}//${segs[2]}`
				const self = this
				self.isIframe = false
				this.serviceLink = ''
				axios(`${BASE_API}/api/public`, {
	             	method: 'POST',
		            data: { url },
		            withCredentials: false,
        			crossdomain: true,
		          })
		            .then(function (res) {
		              	// self.html = res.data.html
		              	self.html = res.data.html.replace(/href="/gi, `href="${hostname}`).replace(/href='/gi, `href='${hostname}`)
		    //           	$('#scrapedPage').innerHTML = '<iframe id="scrapedFrame" class="scraped-page">';
		    //           	var $iframe = $("#scrapedFrame")
		    //           	$iframe.ready(function() {
		    //           		// const _script = `<script src="https://code.jquery.com/jquery-3.4.1.min.js"   integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"><\/script>` + '<script type="text/javascript">$(function() { $(document).on("click", "a", function(e){e.preventDefault()}) })<\/script>' + html
						//     $iframe.contents().find("html").innerHTML = html;
						// });
		            })
		            .catch(error => {
		              console.log(error)
		            })
		            .finally(() => {
		              self.loading = false
		            })
			},
			onLoad (){
				if (JQuery("iframe.iframe")) {
					this.loading = false
				}
			}
		}
	}
</script>

<style lang="scss" type="text/css">
	.iframe {
		width: 100%;
		padding: 20px 0;
		min-height: calc(100vh - 180px);
	}

	.scraped-page {
		width: 100%;
		padding: 20px 0;
		overflow-y: auto;
		height: 100%;
	}

	.overflow-y {
		overflow-y: auto;
		overflow-x: hidden;
		height: 100%;
	}

	.p-relative {
		position: relative;
	}

	.whoxy-date {
		position: absolute;
		top: 10px;
		right: 10px;
	}

	pre {
        overflow-x: auto;
        white-space: pre-line;
        white-space: -moz-pre-wrap;
        white-space: -pre-wrap;
        white-space: -o-pre-wrap;
        word-wrap: break-word;
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

