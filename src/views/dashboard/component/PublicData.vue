<template>
	<v-container
	    id="public-common-data"
	    fluid
	    tag="section"
	  >
	  <blockquote class="blockquote">Below is the data we found on your business.</blockquote>

	  <v-card
	  	class="px-5 py-3"
	  >
	  	<v-card-title>
        {{ title }}
      	</v-card-title>
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
	      background-color="red accent-3"
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
	                  <!-- <v-card shaped outlined class="my-0 pa-2"> -->
	                    <b class="display-2 d-block mb-1">spf_record</b>
	                    <div class="text--secondary">{{result.spf_record}}</div>
	                  <!-- </v-card> -->
	                </v-col>
  					<v-col
	                  v-if="result.spf_record_more"
	                  cols="12"
	                  sm="6"
	                  md="6"
	                >
	                  <!-- <v-card shaped outlined class="my-0 pa-2"> -->
	                    <b class="display-2 d-block mb-1">spf_record_more</b>
	                    <div class="text--secondary">{{result.spf_record_more}}</div>
	                  <!-- </v-card> -->
	                </v-col>
	                <v-col
	                  v-if="result.spf_spoofing_possible"
	                  cols="12"
	                  sm="6"
	                  md="6"
	                >
	                  <!-- <v-card shaped outlined class="my-0 pa-2"> -->
	                    <b class="display-2 d-block mb-1">spf_spoofing_possible</b>
	                    <div class="text--secondary">{{result.spf_spoofing_possible}}</div>
	                  <!-- </v-card> -->
	                </v-col>
	                <v-col
	                  v-if="result['Subdomains Found']"
	                  cols="12"
	                  sm="6"
	                  md="6"
	                >
	                  <!-- <v-card shaped outlined class="my-0 pa-2"> -->
	                    <b class="display-2 d-block mb-1">Subdomains Found</b>
	                    <div class="d-flex flex-wrap">
							<div v-for="domain in result['Subdomains Found'].split(';')">
								<v-chip outlined class="secondary ma-2 pa-2 mb-3 text--secondary">{{domain}}</v-chip>
							</div>
						</div>
	                  <!-- </v-card> -->
	                </v-col>
	                <v-col
	                  v-if="result['Whois/history']"
	                  cols="12"
	                >
	                  <!-- <v-card shaped outlined class="my-0 pa-2"> -->
	                    <b class="display-2 d-block mb-1">Whois/History</b>
	                    <div v-for="item in JSON.parse(result['Whois/history'])" :key="item.num">
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
			publicData: {
				high: {
					spf_record: 'v=spf1 include:_spf.google.com include:mail.zendesk.com include:servers.mcsv.net include:trustpilotservice.com include:customeriomail.com include:aspmx.sailthru.com  ~all',
					spf_record_more: 'SPF record contains an All item: ~all',
					spf_spoofing_possible: 'Spoofing possible for 627846.com!'
				},
				medium: {
					'Subdomains Found': '627846.com;*.627846.com;www.627846.com'
				},
				low: {
					'Whois/history': '[{"num": 1, "domain_name": "grove.co", "query_time": "2016-09-08 09:06:37", "create_date": "2010-07-20", "update_date": "2016-09-08", "expiry_date": "2017-07-19", "domain_registrar": {"iana_id": 146, "registrar_name": "GoDaddy.com, LLC", "whois_server": "whois.godaddy.com", "website_url": "http://registrar.godaddy.com", "registrar_status": "Accredited"}, "registrant_contact": {"full_name": "Keith Gettle", "company_name": "Escrow.com", "mailing_address": "30318 Esperanza", "city_name": "Rancho Santa Margarita", "state_name": "California", "zip_code": "92688", "country_name": "United States", "country_code": "US", "email_address": "dnholding@escrow.com", "phone_number": "18885118600", "fax_number": "14806242598"}, "administrative_contact": {"full_name": "Keith Gettle", "company_name": "Escrow.com", "mailing_address": "30318 Esperanza", "city_name": "Rancho Santa Margarita", "state_name": "California", "zip_code": "92688", "country_name": "United States", "country_code": "US", "email_address": "dnholding@escrow.com", "phone_number": "18885118600", "fax_number": "14806242598"}, "technical_contact": {"full_name": "Keith Gettle", "company_name": "Escrow.com", "mailing_address": "30318 Esperanza", "city_name": "Rancho Santa Margarita", "state_name": "California", "zip_code": "92688", "country_name": "United States", "country_code": "US", "email_address": "dnholding@escrow.com", "phone_number": "18885118600", "fax_number": "14806242598"}, "billing_contact": {"full_name": "Keith Gettle", "company_name": "Escrow.com", "mailing_address": "30318 Esperanza", "city_name": "Rancho Santa Margarita", "state_name": "California", "zip_code": "92688", "country_name": "United States", "country_code": "US", "email_address": "dnholding@escrow.com", "phone_number": "18885118600", "fax_number": "14806242598"}, "name_servers": ["gail.ns.cloudflare.com", "walt.ns.cloudflare.com"], "domain_status": ["OK"]}, {"num": 2, "domain_name": "grove.co", "query_time": "2016-10-14 20:10:32", "create_date": "2010-07-20", "update_date": "2016-10-10", "expiry_date": "2018-07-19", "domain_registrar": {"iana_id": 48, "registrar_name": "eNom, Inc.", "whois_server": "whois.enom.com", "website_url": "http://www.enom.com", "registrar_status": "Accredited"}, "registrant_contact": {"full_name": "Whois Agent", "company_name": "Whois Privacy Protection Service, Inc.", "mailing_address": "PO Box 639C/O grove.co", "city_name": "Kirkland", "state_name": "WA", "zip_code": "98083", "country_name": "United States", "country_code": "US", "email_address": "mbfhljsp@whoisprivacyprotect.com", "phone_number": "14252740657", "fax_number": "14259744730"}, "administrative_contact": {"full_name": "Whois Agent", "company_name": "Whois Privacy Protection Service, Inc.", "mailing_address": "PO Box 639C/O grove.co", "city_name": "Kirkland", "state_name": "WA", "zip_code": "98083", "country_name": "United States", "country_code": "US", "email_address": "mbfhljsp@whoisprivacyprotect.com", "phone_number": "14252740657", "fax_number": "14259744730"}, "technical_contact": {"full_name": "Whois Agent", "company_name": "Whois Privacy Protection Service, Inc.", "mailing_address": "PO Box 639C/O grove.co", "city_name": "Kirkland", "state_name": "WA", "zip_code": "98083", "country_name": "United States", "country_code": "US", "email_address": "mbfhljsp@whoisprivacyprotect.com", "phone_number": "14252740657", "fax_number": "14259744730"}, "billing_contact": {"full_name": "Whois Agent", "company_name": "Whois Privacy Protection Service, Inc.", "mailing_address": "PO Box 639C/O grove.co", "city_name": "Kirkland", "state_name": "WA", "zip_code": "98083", "country_name": "United States", "country_code": "US", "email_address": "mbfhljsp@whoisprivacyprotect.com", "phone_number": "14252740657", "fax_number": "14259744730"}, "name_servers": ["gail.ns.cloudflare.com", "walt.ns.cloudflare.com"], "domain_status": ["clientTransferProhibited"]}, {"num": 3, "domain_name": "grove.co", "query_time": "2017-03-17 13:56:30", "create_date": "2010-07-20", "update_date": "2017-03-15", "expiry_date": "2018-07-19", "domain_registrar": {"iana_id": 48, "registrar_name": "eNom, Inc.", "whois_server": "whois.enom.com", "website_url": "http://www.enom.com", "registrar_status": "Accredited"}, "registrant_contact": {"full_name": "Whois Agent", "company_name": "Whois Privacy Protection Service, Inc.", "mailing_address": "PO Box 639C/O grove.co", "city_name": "Kirkland", "state_name": "WA", "zip_code": "98083", "country_name": "United States", "country_code": "US", "email_address": "qkvygjsw@whoisprivacyprotect.com", "phone_number": "14252740657", "fax_number": "14259744730"}, "administrative_contact": {"full_name": "Whois Agent", "company_name": "Whois Privacy Protection Service, Inc.", "mailing_address": "PO Box 639C/O grove.co", "city_name": "Kirkland", "state_name": "WA", "zip_code": "98083", "country_name": "United States", "country_code": "US", "email_address": "qkvygjsw@whoisprivacyprotect.com", "phone_number": "14252740657", "fax_number": "14259744730"}, "technical_contact": {"full_name": "Whois Agent", "company_name": "Whois Privacy Protection Service, Inc.", "mailing_address": "PO Box 639C/O grove.co", "city_name": "Kirkland", "state_name": "WA", "zip_code": "98083", "country_name": "United States", "country_code": "US", "email_address": "qkvygjsw@whoisprivacyprotect.com", "phone_number": "14252740657", "fax_number": "14259744730"}, "billing_contact": {"full_name": "Whois Agent", "company_name": "Whois Privacy Protection Service, Inc.", "mailing_address": "PO Box 639C/O grove.co", "city_name": "Kirkland", "state_name": "WA", "zip_code": "98083", "country_name": "United States", "country_code": "US", "email_address": "qkvygjsw@whoisprivacyprotect.com", "phone_number": "14252740657", "fax_number": "14259744730"}, "name_servers": ["gail.ns.cloudflare.com", "walt.ns.cloudflare.com"], "domain_status": ["clientTransferProhibited"]}, {"num": 4, "domain_name": "grove.co", "query_time": "2017-06-16 09:34:28", "create_date": "2010-07-20", "update_date": "2017-05-17", "expiry_date": "2018-07-19", "domain_registrar": {"iana_id": 48, "registrar_name": "eNom, Inc.", "whois_server": "whois.enom.com", "website_url": "http://www.enom.com", "registrar_status": "Accredited"}, "registrant_contact": {"full_name": "Whois Agent", "company_name": "Whois Privacy Protection Service, Inc.", "mailing_address": "PO Box 639C/O grove.co", "city_name": "Kirkland", "state_name": "WA", "zip_code": "98083", "country_name": "United States", "country_code": "US", "email_address": "ttxrykcwrd@whoisprivacyprotect.com", "phone_number": "14252740657", "fax_number": "14259744730"}, "administrative_contact": {"full_name": "Whois Agent", "company_name": "Whois Privacy Protection Service, Inc.", "mailing_address": "PO Box 639C/O grove.co", "city_name": "Kirkland", "state_name": "WA", "zip_code": "98083", "country_name": "United States", "country_code": "US", "email_address": "ttxrykcwrd@whoisprivacyprotect.com", "phone_number": "14252740657", "fax_number": "14259744730"}, "technical_contact": {"full_name": "Whois Agent", "company_name": "Whois Privacy Protection Service, Inc.", "mailing_address": "PO Box 639C/O grove.co", "city_name": "Kirkland", "state_name": "WA", "zip_code": "98083", "country_name": "United States", "country_code": "US", "email_address": "ttxrykcwrd@whoisprivacyprotect.com", "phone_number": "14252740657", "fax_number": "14259744730"}, "billing_contact": {"full_name": "Whois Agent", "company_name": "Whois Privacy Protection Service, Inc.", "mailing_address": "PO Box 639C/O grove.co", "city_name": "Kirkland", "state_name": "WA", "zip_code": "98083", "country_name": "United States", "country_code": "US", "email_address": "ttxrykcwrd@whoisprivacyprotect.com", "phone_number": "14252740657", "fax_number": "14259744730"}, "name_servers": ["gail.ns.cloudflare.com", "walt.ns.cloudflare.com"], "domain_status": ["clientTransferProhibited"]}, {"num": 5, "domain_name": "grove.co", "query_time": "2017-07-10 22:42:14", "create_date": "2010-07-20", "update_date": "2017-07-01", "expiry_date": "2018-07-19", "domain_registrar": {"iana_id": 48, "registrar_name": "eNom, Inc.", "whois_server": "whois.enom.com", "website_url": "http://www.enom.com", "registrar_status": "Accredited"}, "registrant_contact": {"full_name": "Whois Agent", "company_name": "Whois Privacy Protection Service, Inc.", "mailing_address": "PO Box 639C/O grove.co", "city_name": "Kirkland", "state_name": "WA", "zip_code": "98083", "country_name": "United States", "country_code": "US", "email_address": "kgnpvlwg@whoisprivacyprotect.com", "phone_number": "14252740657", "fax_number": "14259744730"}, "administrative_contact": {"full_name": "Whois Agent", "company_name": "Whois Privacy Protection Service, Inc.", "mailing_address": "PO Box 639C/O grove.co", "city_name": "Kirkland", "state_name": "WA", "zip_code": "98083", "country_name": "United States", "country_code": "US", "email_address": "kgnpvlwg@whoisprivacyprotect.com", "phone_number": "14252740657", "fax_number": "14259744730"}, "technical_contact": {"full_name": "Whois Agent", "company_name": "Whois Privacy Protection Service, Inc.", "mailing_address": "PO Box 639C/O grove.co", "city_name": "Kirkland", "state_name": "WA", "zip_code": "98083", "country_name": "United States", "country_code": "US", "email_address": "kgnpvlwg@whoisprivacyprotect.com", "phone_number": "14252740657", "fax_number": "14259744730"}, "billing_contact": {"full_name": "Whois Agent", "company_name": "Whois Privacy Protection Service, Inc.", "mailing_address": "PO Box 639C/O grove.co", "city_name": "Kirkland", "state_name": "WA", "zip_code": "98083", "country_name": "United States", "country_code": "US", "email_address": "kgnpvlwg@whoisprivacyprotect.com", "phone_number": "14252740657", "fax_number": "14259744730"}, "name_servers": ["gail.ns.cloudflare.com", "walt.ns.cloudflare.com"], "domain_status": ["clientTransferProhibited"]}, {"num": 6, "domain_name": "grove.co", "query_time": "2017-08-30 19:51:58", "create_date": "2010-07-20", "update_date": "2017-08-01", "expiry_date": "2018-07-19", "domain_registrar": {"iana_id": 48, "registrar_name": "eNom, Inc.", "whois_server": "whois.enom.com", "website_url": "http://www.enom.com", "registrar_status": "Accredited"}, "registrant_contact": {"full_name": "Whois Agent", "company_name": "Whois Privacy Protection Service, Inc.", "mailing_address": "PO Box 639C/O grove.co", "city_name": "Kirkland", "state_name": "WA", "zip_code": "98083", "country_name": "United States", "country_code": "US", "email_address": "sccbxdsvcs@whoisprivacyprotect.com", "phone_number": "14252740657", "fax_number": "14259744730"}, "administrative_contact": {"full_name": "Whois Agent", "company_name": "Whois Privacy Protection Service, Inc.", "mailing_address": "PO Box 639C/O grove.co", "city_name": "Kirkland", "state_name": "WA", "zip_code": "98083", "country_name": "United States", "country_code": "US", "email_address": "sccbxdsvcs@whoisprivacyprotect.com", "phone_number": "14252740657", "fax_number": "14259744730"}, "technical_contact": {"full_name": "Whois Agent", "company_name": "Whois Privacy Protection Service, Inc.", "mailing_address": "PO Box 639C/O grove.co", "city_name": "Kirkland", "state_name": "WA", "zip_code": "98083", "country_name": "United States", "country_code": "US", "email_address": "sccbxdsvcs@whoisprivacyprotect.com", "phone_number": "14252740657", "fax_number": "14259744730"}, "billing_contact": {"full_name": "Whois Agent", "company_name": "Whois Privacy Protection Service, Inc.", "mailing_address": "PO Box 639C/O grove.co", "city_name": "Kirkland", "state_name": "WA", "zip_code": "98083", "country_name": "United States", "country_code": "US", "email_address": "sccbxdsvcs@whoisprivacyprotect.com", "phone_number": "14252740657", "fax_number": "14259744730"}, "name_servers": ["gail.ns.cloudflare.com", "walt.ns.cloudflare.com"], "domain_status": ["clientTransferProhibited"]}]'
				}
			}
		}),

		async mounted () {
	    },

	    methods: {
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
	    },

	    props: {
	      title: {
	        type: String,
	        default: 'Personal Data'
	      },
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