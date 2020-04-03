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
        body: 'High risk findings mean the impact and likelihood of a security event is high. Expect reputation and financial damage. These findings should be addressed immediately.'
      }
    }),

    components: {
      CategoryRisk: () => import('../component/Category'),
    }
  }
</script>
