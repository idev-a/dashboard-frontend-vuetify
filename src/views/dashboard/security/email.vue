<template>
  <category-risk
    category="email"
    title="Email Security"
    :banner="banner"
  />
</template>

<script>
  
  export default {
    name: 'DashboardSecurityEmail',

    data: () => ({
      banner: {
        title: 'What is Email Security?',
        body: 'Email security describes different techniques for keeping sensitive information in email communication and accounts secure against unauthorized access, loss or compromise.'
      }
    }),

    components: {
      CategoryRisk: () => import('../component/Category'),
    }
  }
</script>
