<template>
	<v-container
	    id="public-common-data"
	    fluid
	    tag="section"
	  >
		<public-data
			title="Personal Data"
			category="personal"
		>
  		</public-data>
  	</v-container>
</template>

<script>
	export default {
		name: 'DashboardPublicPersonalData',

		data: () => ({
		}),

		components: {
	      PublicData: () => import('../component/PublicData'),
	    }
	}
</script>