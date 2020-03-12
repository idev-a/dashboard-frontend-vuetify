<template>
  <category-risk
    category="netowrk"
    title="Network Security"
  />
</template>

<script>
  export default {
    name: 'DashboardSecurityNetwork',

    components: {
      CategoryRisk: () => import('../component/Category'),
    }
  }
</script>
