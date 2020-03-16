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
			<div class="scraped-page">
				<div
					v-html="html"
				>
				</div>
			</div>
		</v-card>
	</v-container>
</template>

<script>
	import { BASE_API } from '../../../api'
	import axios from 'axios'

	import JQuery from 'jquery'
	let $ = JQuery

	$(document).on('click', '.scraped-page a', function(e){
		e.preventDefault()
		console.log(e)
	})

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
				services: [
					'builtWith',
					'ssllab',
					'crunchbase',
					'shodan',
				],
				links: {
					builtWith: 'https://builtwith.com/',
					ssllab: 'https://www.ssllabs.com/ssltest/analyze.html?hideResults=on&d=',
					crunchbase: 'https://www.crunchbase.com/organization/grove',
					shodan: 'https://www.shodan.io/search?query=',
				}
			}
		},

		mounted () {
			let user = {}
	        try {
	          user = JSON.parse(localStorage.getItem('user'))
	        } catch(e) {}
	        this.company = user.email.split('@')[1];
		},

		methods: {
			changeService (data) {
				this.loading = true
				this.serviceLink = this.links[data] + this.company
				if (['builtWith'].includes(data)) {
					this.isIframe = true
				} else {
					this.fetchPage(data)	              	
				}
			},
			fetchPage(data) {
				const url = this.links[data] + this.company
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
		              	self.html = res.data.html
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

	/* ssllab css */
	#header {
	    width: 1100px;
	    padding-top: 8px;
		padding-bottom: 8px;
	    border-top: 18px solid #de1d0b;
		border-bottom: 1px solid #BCD4DD;
	}

	#mini-header {
		width: 1100px;
		padding-top: 8px;
		padding-bottom: 8px;
		border-top: 18px solid #de1d0b;
		border-bottom: 1px solid #BCD4DD;
		margin-bottom: 20px;
	}

	#dev-header {
	    padding: 10px 20px;
	    font-weight: bold;
	    background-color: #fffacd;
	}

	#logo {
		float: left;
		margin: 0px;
		padding: 4px;
		margin-left: 14px;
		padding-top: 6px;
		padding-bottom: 6px;
	}

	#logo-powered-by {
		float: right;
		padding: 10px;
		padding-right: 30px;
	}

	#logo-co-branded {
		float: left;
		margin: 0px;
		padding: 10px;
		padding-left: 30px;
	}
		
	#navigation {
	    float: right;
		margin-top: 10px;
		margin-right: 10px;	
		font-family: Arial, Helvetica, sans-sefif;
		font-size: 15px;
		font-weight: bold;
	}

		#navigation .link {	    
		    color: #444444;	    
			text-decoration: none;
			padding-right: 25px;		
		}
		
		#navigation .link:hover {	    
			text-decoration: underline;
		}
		

	#pageEnd {
	    width: 1100px;
		background: #ffffff;
		margin: auto;
		text-align: left;
		padding-bottom: 10px;
		border-left: 1px solid #BCD4DD;
		border-right: 1px solid #BCD4DD;
		border-bottom: 1px solid #BCD4DD;	
	}

	#copyright {
	    width: 1100px;
	    padding: 10px;
	    padding-left: 20px;
	    padding-bottom: 0px;    
	}

	#breadcrumbs {
		margin-top: 6px;
		margin-left: 30px;
	}

	#page {
		width: 1100px;
		background: #ffffff;
		margin: auto;
		text-align: left;
		padding-bottom: 10px;
		border-left: 1px solid #BCD4DD;
		border-right: 1px solid #BCD4DD;
		border-bottom: 1px solid #BCD4DD;
	}

	#main {
	    padding: 30px;
		padding-top: 10px;
	}

	#multiTable {
	    border: 3px solid #a6c2c4;
	    width: 1040px;
	}

	#multiTable td {
	    border: 1px solid #CFECEC;
	}

	#multiTable th {
    cursor: pointer;
    cursor: hand;
	}

	#multiTable th {
	    padding: 14px;
	    background: #CFECEC;
	    border: 1px solid #a6c2c4;
	    font-size: 18px;
	}
	.text-align-left {
	    text-align: left;
	}
</style>