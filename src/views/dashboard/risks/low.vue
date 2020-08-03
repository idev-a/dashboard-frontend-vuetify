<template>
  <category-risk
    category="low"
    title="Low Risks"
    :banner="banner"
  />
</template>

<script>
  
  export default {
    name: 'DashboardLowRisk',

    data: () => ({
      banner: {
        title: 'What is Low Risk?',
        body: 'Low Implies a relatively minor threat to the risk.'
      }
    }),

    components: {
      CategoryRisk: () => import('../component/Category'),
    }
  }
</script>
