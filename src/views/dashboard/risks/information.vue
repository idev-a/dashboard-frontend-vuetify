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
        body: 'Information risk is a calculation based on the likelihood that an unauthorized user will negatively impact the confidentiality, integrity, and availability of data that you collect, transmit, or store.'
      }
    }),

    components: {
      CategoryRisk: () => import('../component/Category'),
    }
  }
</script>
