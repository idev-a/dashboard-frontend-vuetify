<template>
	<v-expansion-panel
		v-if="data"
	>
		<v-expansion-panel-header>
			<b class="display-2 d-block">{{data.question}}</b>
		</v-expansion-panel-header>
		<v-expansion-panel-content>
        	<v-row>
              	<v-col
                  	cols="12"
                  	md="6"
              	>
              		<b>Country:</b> <span>{{get_json(data).urlscan_country}}</span>
              	</v-col>
				<v-col
                  	cols="12"
                  	md="6"
              	>
	              	<b>IP Address:</b> <span>{{get_json(data).urlscan_ip_address}}</span>
              	</v-col>
				<v-col
                  	cols="12"
                  	md="6"
              	>
	              	<b>IPV6:</b> <span>{{get_json(data).urlscan_ipv6}}</span>
              	</v-col>
              	<v-col
                  	cols="12"
                  	class="d-flex align-center"
              	>
              		<b>Web Apps:</b> 
              		<span class="d-flex flex-wrap">
						<span v-for="app in get_json(data).urlscan_web_apps.split(';')">
							<v-chip outlined class="secondary ma-2 pa-2 mb-3">{{app}}</v-chip>
						</span>
					</span>
              	</v-col>
              	<v-col
                  	cols="12"
                  	md="6"
              	>
              		<b>Server:</b> <span>{{get_json(data).urlscan_server}}</span>
              	</v-col>
              	<v-col
                  	cols="12"
                  	md="6"
              	>
              		<b>Number of Requests:</b> <span>{{get_json(data).urlscan_number_of_requests}}</span>
              	</v-col>
              	<v-col
                  	cols="12"
                  	md="6"
              	>
              		<b>Ads Blocked:</b> 
              		<v-chip outlined class="ma-2 mb-3" :color="get_json(data).urlscan_ads_blocked == 1 ? 'green' : 'black'" >{{get_json(data).urlscan_ads_blocked == 1 ? 'YES' : 'No'}}</v-chip>
              	</v-col>
              	<v-col
                  	cols="12"
                  	md="6"
              	>
              		<b>HTTP Requests:</b> <span>{{get_json(data).urlscan_http_requests}}</span>
              	</v-col>
              	<v-col
                  	cols="12"
                  	md="6"
              	>
              		<b>Unique Country Counts:</b> <span>{{get_json(data).urlscan_unique_country}}</span>
              	</v-col>
              	<v-col
                  	cols="12"
                  	md="6"
              	>
              		<b>Malicious Requests:</b> <span>{{get_json(data).urlscan_malicious_requests}}</span>
              	</v-col>
              	<v-col
                  	cols="12"
                  	class="d-flex"
              	>
              		<b>Pointed Domains:</b> 
              		<span class="d-flex flex-wrap">
						<span v-for="domain in get_json(data).urlscan_pointed_domains.split(';')">
							<v-chip outlined class="secondary ma-2 pa-2 mb-3">{{domain}}</v-chip>
						</span>
					</span>
              	</v-col>
			</v-row>
		</v-expansion-panel-content>
	</v-expansion-panel>
</template>	

<script>
	import { get_json} from '../../../util'
	export default {
		name: 'PublicItemUrlscan',

		props: {
			data: {
				type: Object
			},
		},

		methods: {
			get_json,
		}
	}
</script>