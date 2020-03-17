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
		                  	<v-chip class="whoxy-date secondary">{{beautifyDate(item.registrant_contact.query_time)}}</v-chip>
		                    <div><b>Owner:</b> <span>{{item.registrant_contact.full_name}}</span></div>
		                    <div><b>Company:</b> <span>{{item.administrative_contact.company_name}}</span></div>
		                    <div><b>Domain:</b> <span>{{item.domain_registrar.registrar_name}}</span></div>
		                    <div><b>Geolocation:</b> <span>{{item.registrant_contact.city_name}}, {{item.registrant_contact.state_name}} {{item.registrant_contact.zip_code}}, {{item.registrant_contact.country_name}}</span></div>
		                    <div><b>Email:</b> <span>{{item.administrative_contact.email_address}}</span></div>
		                    <div><b>Phone:</b> <span>{{item.administrative_contact.phone_number}}</span></div>
		                    <div><b>Email:</b> <span v-html="beautifyEmail(item.administrative_contact.email_address)"></span></div>
		                    <div><b>Nameservers:</b> <span>{{item.name_servers.join(', ')}}</span></div>
		                    <div><b>Status:</b> <span>{{item.domain_status[0]}}</span></div>
		                  </v-card>
		                </v-col>
		            </v-row>
				</div>
			</div>
			<div v-if="select['spoofcheck']" class="py-4 pa-4">
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
			<div v-if="select['ctfr']" class="py-4 pa-4">
				<v-card-title>CTFR (Sub domains)</v-card-title>
				<div class="d-flex flex-wrap">
					<div v-for="domain in data.ctfr_subdomain.split(';')">
						<v-chip outlined class="secondary ma-2 pa-2 mb-3">{{domain}}</v-chip>
					</div>
				</div>
			</div>
			<div v-if="select['urlscan']" class="py-4 pa-4">
				<v-card-title>Urlscan.io</v-card-title>
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
					shodan: 'https://www.shodan.io/search?query=',
				},
				data: {
				}
			}
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
							this.data['whoxy'] = JSON.parse(this.data['whoxy'])
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
</style>

