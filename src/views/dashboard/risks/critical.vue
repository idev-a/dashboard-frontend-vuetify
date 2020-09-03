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
        body: 'Critical Risk is a threat that needs to be addressed immediately. These risks are imminent and can be catastrophic to the business.  Expect reputation and financial damage.'
      }
    }),

    components: {
      CategoryRisk: () => import('../component/Category'),
    }
  }
</script>
