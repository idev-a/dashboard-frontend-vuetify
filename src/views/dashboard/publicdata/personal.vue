<template>
	<public-data
		title="Personal Data"
	>
  	</public-data>
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