<template>
	<public-data
		title='Business Data'
		category='business'
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