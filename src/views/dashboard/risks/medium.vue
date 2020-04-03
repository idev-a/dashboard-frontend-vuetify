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
        body: 'Medium risk findings mean the impact and likelihood of a security event is probable. Reputation and financial  damage is moderate. These findings should have a resolution or control.'
      }
    }),

    components: {
      CategoryRisk: () => import('../component/Category'),
    }
  }
</script>
