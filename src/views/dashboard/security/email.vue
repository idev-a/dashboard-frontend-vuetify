<template>
  <category-risk
    category="email"
    title="Email Security"
  />
</template>

<script>
  
  export default {
    name: 'DashboardSecurityEmail',

    components: {
      CategoryRisk: () => import('../component/Category'),
    }
  }
</script>
