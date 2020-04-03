<template>
  <category-risk
    category="low"
    title="Low Risks"
    :banner="banner"
  />
</template>

<script>
  
  export default {
    name: 'DashboardLowRisk',

    data: () => ({
      banner: {
        title: 'What is Low Risk?',
        body: 'Low risk findings mean the impact and likelihood is a security event is rare. If a security event in this category were to occur there would be little impact financially and reputation on the business.'
      }
    }),

    components: {
      CategoryRisk: () => import('../component/Category'),
    }
  }
</script>
