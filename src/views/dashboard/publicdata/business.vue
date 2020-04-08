<template>
	<v-container
	    id="public-common-data"
	    fluid
	    tag="section"
	  >
		<public-data
			title='Business Data'
			category='business'
		>
	  	</public-data>
  	</v-container>
</template>

<script>
	export default {
		name: 'DashboardPublicBusinessData',

		data: () => ({
		}),

		components: {
	      PublicData: () => import('../component/PublicData'),
	    }
	}
</script>