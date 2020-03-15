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
	      icon="mdi-security"
	      title="Email Security"
	      class="px-5 py-3 iframe"
	    >
			<vue-friendly-iframe
				v-if="serviceLink"
				className="iframe"
				:src="serviceLink" 
				@iframe-load="onLoad"
				allow="Allow"
				name="builtWith"
				crossorigin="X-Frame-Options"
			>
				
			</vue-friendly-iframe>
		</v-card>
	</v-container>
</template>

<script>
	import JQuery from 'jquery'
	let $ = JQuery

	export default {
		name: 'DashboardPublicData',

		data () {
			return  {
				loading: false,
				serviceLink: '',
				service: '',
				services: [
					'builtWith',
					'crunchbase',
					'shodan'
				],
				links: {
					builtWith: 'https://builtwith.com/grove.co',
					crunchbase: 'https://www.crunchbase.com/organization/grove',
					shodan: 'https://www.shodan.io/search?query=grove.co',
				}
			}
		},

		methods: {
			changeService (data) {
				this.serviceLink = this.links[this.service]
			},
			onLoad (){
				if (JQuery("iframe.iframe")) {
					const iFrame = JQuery("iframe.iframe").contents();
					iFrame.find('.navhome.bg-dark').remove()
				}
			}
		}
	}
</script>

<style lang="scss" type="text/css">
	.iframe {
		width: 100%;
		height: calc(100vh - 180px);
	}

</style>