<template>
  <category-risk
    category="medium"
    title="Medium Risks"
    :banner="banner"
  />
</template>

<script>
  
  export default {
    name: 'DashboardMediumRisk',

    data: () => ({
      banner: {
        title: 'What is Medium Risk?',
        body: 'Medium Risk - These risks may be acceptable  as long as they are monitored to ensure risk does not increase.  These risks are typically necessary to fulfill business functions.'
      }
    }),

    components: {
      CategoryRisk: () => import('../component/Category'),
    }
  }
</script>
