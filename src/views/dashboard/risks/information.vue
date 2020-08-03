<template>
  <category-risk
    category="informational"
    title="Information Risks"
    :banner="banner"
  />
</template>

<script>
  
  export default {
    name: 'DashboardInformationRisk',

    data: () => ({
      banner: {
        title: 'What is Information Risk?',
        body: 'Informational No immediate threat. May provide suggestions for improvement.'
      }
    }),

    components: {
      CategoryRisk: () => import('../component/Category'),
    }
  }
</script>
