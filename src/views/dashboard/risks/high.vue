<template>
  <category-risk
    category="high"
    title="High Risks"
    :banner="banner"
  />
</template>

<script>
  
  export default {
    name: 'DashboardHighRisk',

    data: () => ({
      banner: {
        title: 'What is High Risk?',
        body: 'High Risk implies the impact and likelihood of a severity event is high. Expect reputation and financial damage. Risks should be addressed immediately. These risks need to have an active control to mitigate.'
      }
    }),

    components: {
      CategoryRisk: () => import('../component/Category'),
    }
  }
</script>
