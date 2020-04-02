<template>
  <category-risk
    category="device"
    title="Device Security"
    :banner="banner"
  />
</template>

<script>
  export default {
    name: 'DashboardSecurityDevice',

    data: () => ({
      banner: {
        title: 'What is Device Security?',
        body: 'Mobile device security refers to the measures taken to protect sensitive data stored on portable devices. It is also the ability to prevent unauthorized users from using mobile devices to access the enterprise network.'
      }
    }),

    components: {
      CategoryRisk: () => import('../component/Category'),
    }
  }
</script>
