<template>
  <category-risk
    category="critical"
    title="Critical Risks"
    :banner="banner"
  />
</template>

<script>
  
  export default {
    name: 'DashboardCriticalRisk',

    data: () => ({
      banner: {
        title: 'What is Critical Risk?',
        body: 'Critical risks are defined as events that can cause grave damage to the mine operation or result in worker fatality. These are the “show stoppers” essential for control.'
      }
    }),

    components: {
      CategoryRisk: () => import('../component/Category'),
    }
  }
</script>
