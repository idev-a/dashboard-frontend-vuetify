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
        body: 'Informational - No immediate threat'
      }
    }),

    components: {
      CategoryRisk: () => import('../component/Category'),
    }
  }
</script>
