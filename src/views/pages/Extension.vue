<template>
 	<v-container
	    id="extension"
	    class="fill-height justify-center"
	    tag="section"
  	>
	  	<v-row
	      align="center"
	      class="text-center"
	      justify="center"
	    >
	      <v-col		
	        class="mb-10"
	        cols="12"
	      >
	        <pages-heading class="mb-12">
	          Your Dashboard for Chrome Extensions
	        </pages-heading>

	        <div class="display-1 font-weight-light grey--text text--darken-2">
	          We have found out the vulnerabilities among &nbsp;<br class="hidden-sm-and-down"> your extensions.
	        </div>
	      </v-col>
	      	<v-progress-linear
	      	  v-if="loading"
		      indeterminate
		      color="green"
		    ></v-progress-linear>
	      <template v-else v-for="(ext, i) in exts">
	        <v-col
	          :key="i"
	          class="d-flex"
	          cols="12"
	          sm="6"
	          md="3"
	        >
	          <extension-card :ext="ext"></extension-card>
	        </v-col>

	       <!--  <v-col
	          v-if="(i >= 1 && $vuetify.breakpoint.smAndDown) && i + 1 !== exts.length"
	          :key="`divider-${i}`"
	          class="pa-6"
	          cols="12"
	        >
	          <v-divider />
	        </v-col> -->
	      </template>
	  	</v-row>
	</v-container>	
</template>
<script>
import axios from 'axios'
import { BASE_API } from '../../api'
  export default {
    name: 'PagesExtension',

    components: {
      PagesHeading: () => import('./components/Heading'),
      ExtensionCard: () => import('./components/ExtensionCard'),
    },

    data: () => ({
    	loading: false,
    	message: '',
    	exts: [
    		{
	          id: 'kfhkikpdmehlpkaiplafjkaicdljldcf',
	          name: 'Google Drive',
	          icon: "https://lh3.googleusercontent.com/XDScQo39jp9nk8kzAY_GOGYkb999mmMIqQGacISVnkGNc-tnZDZ1lD4valDhPOz7wxTm3pgk=w128-h128-e365",
	          version: '1.1',
	          risk: 120,
	          desc: 'This is good if your company size is between 2 and 10 Persons.',
	        },
	        {
	          id: 'kfhkikpdmehlpkaiplafjkaicdljldcf',
	          name: 'Small Company',
	          icon: 'https://lh3.googleusercontent.com/XDScQo39jp9nk8kzAY_GOGYkb999mmMIqQGacISVnkGNc-tnZDZ1lD4valDhPOz7wxTm3pgk=w128-h128-e365',
	          version: '2.3',
	          risk: 320,
	          desc: 'This is good if your company size is between 2 and 10 Persons.',
	        },
    	]
	}),

    mounted () {
    	this.fetchExts()
    },

    methods: {
    	async fetchExts () {
    		this.loading = true
	    	try {
		    	const res = await axios({
	      			url: `${BASE_API}/api/admin/ext/mine`,
	      			data: { email: this.$route.params.email },
	      			method: 'POST'
	      		})
	      		this.exts = res.data.exts
      			this.message = res.data.message
	    	} catch(e) {
	    		this.message = 'Something wrong happened on the server.'
	    	} finally {
      			this.loading = false
	    	}
    	}
    },

    
}
</script>