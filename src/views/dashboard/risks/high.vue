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
        body: 'High Risk is a threat that needs to be addressed immediately.The impact and likelihood of this risk is probable. These risks should be addressed immediately.'
      }
    }),

    components: {
      CategoryRisk: () => import('../component/Category'),
    }
  }
</script>
