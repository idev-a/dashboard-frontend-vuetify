<template>
	<v-expansion-panel
		v-if="data"
	>
		<v-expansion-panel-header>
			<b class="display-2 d-block">{{data.question}}</b>
		</v-expansion-panel-header>
		<v-expansion-panel-content>
	        <div v-for="item in get_json(data)" :key="item.num">
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
		</v-expansion-panel-content>
	</v-expansion-panel>
</template>	

<script>
	import { get_json, beautifyEmail, beautifyDate } from '../../../util'
	export default {
		name: 'PublicDataWhoxy',

		props: {
			data: {
				type: Object,
			},
		},

		methods: {
			get_json,

			beautifyEmail,

			beautifyDate
		}
	}
</script>