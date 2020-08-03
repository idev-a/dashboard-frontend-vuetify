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
        body: 'Critical Risk Implies an immediate, easily accessible threat The impact and likelihood of this risk is imminent. Risks should be addressed immediately. These risks cause significant harm to the business.  Risk needs to be downgraded.'
      }
    }),

    components: {
      CategoryRisk: () => import('../component/Category'),
    }
  }
</script>
