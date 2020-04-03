<template>
	<public-data
		title="Business Data"
	>
  	</public-data>
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