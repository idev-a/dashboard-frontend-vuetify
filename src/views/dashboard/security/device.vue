<template>
  <category-risk
    category="device"
    title="Device Security"
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
