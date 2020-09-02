<template>
	<v-expansion-panel
		v-if="data"
	>
		<v-expansion-panel-header>
      <v-row align="center">
        <div  v-if="mode" class="align-self-center">
          <v-btn
            color="success"
            icon
            @click="showDialog"
          >
            <v-icon
              color="success"
            >
              mdi-pencil
            </v-icon>
          </v-btn>
        </div>
        <b class="display-2 d-block">{{data.Question}}</b>
      </v-row>
		</v-expansion-panel-header>
		<v-expansion-panel-content>
    	<v-row>
      	<v-col
          	cols="12"
          	md="4"
      	>
      		<b>Country:</b> <span>{{get_json(data).urlscan_country}}</span>
      	</v-col>
	      <v-col
            	cols="12"
            	md="4"
        	>
          	<b>IP Address:</b> <span>{{get_json(data).urlscan_ip_address}}</span>
        	</v-col>
		    <v-col
        	cols="12"
        	md="4"
      	>
        	<b>IPV6:</b> <span>{{get_json(data).urlscan_ipv6}}</span>
      	</v-col>
      	<v-col
        	cols="12"
        	class="d-flex align-center"
      	>
      		<b>Web Apps:</b> 
      		<span class="d-flex flex-wrap">
						<span v-for="app in split(get_json(data).urlscan_web_apps)">
							<v-chip outlined class="secondary ma-2 pa-2 mb-3">{{app}}</v-chip>
						</span>
					</span>
      	</v-col>
      	<v-col
          	cols="12"
          	md="4"
      	>
      		<b>Server:</b> <span>{{get_json(data).urlscan_server}}</span>
      	</v-col>
      	<v-col
          	cols="12"
          	md="4"
      	>
      		<b>Number of Requests:</b> <span>{{get_json(data).urlscan_number_of_requests}}</span>
      	</v-col>
      	<v-col
        	cols="12"
        	md="4"
      	>
      		<b>Ads Blocked:</b> 
      		<v-chip outlined class="ml-2" :color="get_json(data).urlscan_ads_blocked == 1 ? 'green' : 'black'" >{{get_json(data).urlscan_ads_blocked == 1 ? 'YES' : 'No'}}</v-chip>
      	</v-col>
      	<v-col
        	cols="12"
        	md="4"
      	>
      		<b>HTTP Requests:</b> <span>{{get_json(data).urlscan_http_requests}}</span>
      	</v-col>
      	<v-col
        	cols="12"
        	md="4"
      	>
      		<b>Unique Country Counts:</b> <span>{{get_json(data).urlscan_unique_country}}</span>
      	</v-col>
      	<v-col
        	cols="12"
        	md="4"
      	>
      		<b>Malicious Requests:</b> <span>{{get_json(data).urlscan_malicious_requests}}</span>
      	</v-col>
      	<v-col
        	cols="12"
        	class="d-flex"
      	>
      		<b>Pointed Domains:</b> 
      		<span class="d-flex flex-wrap">
						<span v-for="domain in split(get_json(data).urlscan_pointed_domains)">
							<v-chip outlined class="secondary ma-2 pa-2 mb-3">{{domain}}</v-chip>
						</span>
				   </span>
      	</v-col>
        <update-answer-dialog 
          v-if="mode"
          :loading="loading"
          @update-answer="updateItem"
        />
			</v-row>
		</v-expansion-panel-content>
	</v-expansion-panel>
</template>	

<script>
	import { get_json} from '../../../util'
  import { mapState, mapActions } from 'vuex';

	export default {
		name: 'PublicItemUrlscan',

		props: {
			data: {
				type: Object
			},
      mode: {
        type: Boolean,
        default: false
      },
		},

    components: {
      UpdateAnswerDialog: () => import('./UpdateAnswerDialog'),
    },

    data: () => ({
      loading: false,
    }),

		methods: {
      ...mapActions('publicdata', ['updateAnswer', 'updateComponentKey', 'setPublicItem', 'showUpdateAnswerDialog', 'showUploadBtn', 'setStaticField']),

			get_json,

      split (data) {
        if (get_json(data).urlscan_web_apps) {
          return get_json(data).urlscan_web_apps.split(';') 
        }
        return []
      },

      showDialog () {
          this.showUploadBtn(false)
          this.setStaticField(true)
          this.setPublicItem(this.data)
          this.showUpdateAnswerDialog(true)
        },

      async updateItem (item) {
        this.loading = true
        await this.updateAnswer(item)
        this.loading = false

        this.showUpdateAnswerDialog(false)
        this.updateComponentKey()
      }
		}
	}
</script>