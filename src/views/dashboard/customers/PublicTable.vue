<template>
	<v-container
	    id="public_data-table"
	    fluid
	    tag="section"
  	>
	    <v-card
	      class="pa-5"
	    >
		</v-card>
	</v-container>
</template>

<script>
	import { BASE_API } from '../../../api'
	import { validEmail } from '../../../util'
	import axios from 'axios'

 	export default {
	    name: 'PublicDataTable',

	    data: () => ({
	      loading: true,
      	})
	}
</script>