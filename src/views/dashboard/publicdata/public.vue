<template>
	<v-container
	    id="public-data"
	    fluid
	    tag="section"
	  >
	  	<v-select
	  	  v-model="service"
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
			
			<div v-if="select['ssllab']" id="scrapedPage">
				<v-card-title>SSLLab</v-card-title>
				<div v-html="html"></div>
			</div>
			<div v-if="select['whoxy']" class="overflow-y">
				<v-card-title>Whoxy</v-card-title>
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
				<v-card-title>Urlscan.io</v-card-title>
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
				<v-card-title>Shodan.io</v-card-title>
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
						<div class=""><b>ASN:</b> <span>{{data.shodan.asn}}</span></div>
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
						    <b class="display-2">Ports</b>
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
				    <b class="display-2">Services</b>
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
	                		<v-chip label class="dark pa-0 px-5">{{service.ssl ? 'https':'http'}}</v-chip>
	                	</div>
	                	<pre >{{service.data}}</pre>
						<div v-if="service.http">
							<div v-html="service.http.html"></div>
							<div>{{service.http.title}}</div>
						</div>
						<div v-if="service.ssl">
							<div v-if="service.ssl">
								<div class="display-1">SSL Certificate</div>
								<div class="mb-1"><b>Version:</b> <span>{{service.ssl.cert.version}}</span></div>
								<div class="mb-1"><b>Serial Number:</b> <span>{{service.ssl.cert.serial}}</span></div>
								<div class="mb-1"><b>Signature Algorithm:</b> <span>{{service.ssl.cert.sig_alg}}</span></div>
								<div class="mb-1"><b>Issuer:</b> <span v-for="(val, name) in service.ssl.cert.issuer"><span class="ma-1">{{name}}={{val}},</span></span></div>
								<div class="mb-1"><b>Subject:</b> <span v-for="(val, name) in service.ssl.cert.subject"><span class="ma-1">{{name}}={{val}},</span></span></div>
							</div>
						</div>
	              	</v-col>
				</v-row>
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
				service: '',
				html: '',
				select: {},
				services: [
					'builtWith',
					'ssllab',
					'crunchbase',
					'shodan',
					'spoofcheck',
					'urlscan',
					'ctfr',
					'hibp',
					'whoxy'
				],
				links: {
					builtWith: 'https://builtwith.com/',
					ssllab: 'https://www.ssllabs.com/ssltest/analyze.html?hideResults=on&d=',
					crunchbase: 'https://www.crunchbase.com/organization/grove',
				},
				data: {
				}
			}
		},

		computed: {
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
			checkSPFPossible (possible) {
				if (possible.includes('Spoofing possible')) {
					return `<v-sheet class="pa-1 py-2 orange">${possible}</v-sheet>`
				} else {
					return `<v-sheet class="pa-1 py-2 success">${possible}</v-sheet>`
				}
			},

			beautifyDate (date) {
				return this.$moment(date).format('DD MMM YYYY')
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
						case 'spoofcheck':
						case 'ctfr':
						case 'urlscan':
							this.loading = false
							break
						case 'ssllab':
							this.fetchPage(data)    	
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
		height: calc(100vh - 180px);
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
        white-space: pre-wrap;
        white-space: -moz-pre-wrap;
        white-space: -pre-wrap;
        white-space: -o-pre-wrap;
        word-wrap: break-word;
     }
</style>

