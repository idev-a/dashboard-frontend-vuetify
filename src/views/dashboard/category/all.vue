<template>
  <category-risk
    category="all"
    title="General Security"
  />
</template>

<script>
  export default {
    name: 'DashboardSecurityDevice',

    components: {
      CategoryRisk: () => import('../component/Category'),
    }
  }
</script>
